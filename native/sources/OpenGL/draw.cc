#define WIN32_LEAN_AND_MEAN
#define NOGDI
#include <windows.h>
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <napi.h>
#include <vector>
#include <cmath>
#include <thread>
#include <mutex>
#include <condition_variable>
#include "OpenGL/draw.h"

// 全局变量
static float rotationAngle = 0.0f;
static GLuint fbo = 0;
static GLuint texture = 0;
static bool initialized = false;
static bool stopRendering = false;
std::thread renderThread;
std::mutex renderMutex;
std::condition_variable renderCondition;
std::vector<unsigned char> frameBufferData(4 * 800 * 600); // 保存帧数据
bool frameReady = false;

void InitializeFBO(int width, int height) {
    glGenFramebuffers(1, &fbo);
    glBindFramebuffer(GL_FRAMEBUFFER, fbo);

    glGenTextures(1, &texture);
    glBindTexture(GL_TEXTURE_2D, texture);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, NULL);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, texture, 0);

    if (glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE) {
        fprintf(stderr, "Failed to create framebuffer\n");
    }

    glBindFramebuffer(GL_FRAMEBUFFER, 0);
}

void RenderLoop() {
    if (!glfwInit()) return;

    glfwWindowHint(GLFW_VISIBLE, GLFW_FALSE);
    GLFWwindow* window = glfwCreateWindow(800, 600, "Hidden OpenGL Window", NULL, NULL);
    if (!window) {
        glfwTerminate();
        return;
    }

    glfwMakeContextCurrent(window);

    if (glewInit() != GLEW_OK) {
        glfwTerminate();
        return;
    }

    int width = 800, height = 600;
    if (fbo == 0) {
        InitializeFBO(width, height);
    }

    while (true) {
        std::unique_lock<std::mutex> lock(renderMutex);
        renderCondition.wait(lock, []{ return !frameReady || stopRendering; });

        if (stopRendering) break;

        glBindFramebuffer(GL_FRAMEBUFFER, fbo);
        glViewport(0, 0, width, height);
        glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        rotationAngle += 1.0f;
        glPushMatrix();
        glRotatef(rotationAngle, 0.0f, 0.0f, 1.0f);

        glBegin(GL_TRIANGLES);
        glColor3f(1.0f, 0.0f, 0.0f); glVertex2f(-0.5f, -0.5f);
        glColor3f(0.0f, 1.0f, 0.0f); glVertex2f(0.5f, -0.5f);
        glColor3f(0.0f, 0.0f, 1.0f); glVertex2f(0.0f, 0.5f);
        glEnd();

        glPopMatrix();
        glFlush();

        glReadPixels(0, 0, width, height, GL_RGBA, GL_UNSIGNED_BYTE, frameBufferData.data());

        frameReady = true;
        lock.unlock();
        renderCondition.notify_one();
    }

    glfwDestroyWindow(window);
    glfwTerminate();
}

Napi::Value StartRenderLoop(const Napi::CallbackInfo& info) {
    if (initialized) {
        Napi::TypeError::New(info.Env(), "Render loop already started").ThrowAsJavaScriptException();
        return info.Env().Null();
    }

    stopRendering = false;
    renderThread = std::thread(RenderLoop);
    initialized = true;

    return info.Env().Undefined();
}

Napi::Value GetFrame(const Napi::CallbackInfo& info) {
    std::unique_lock<std::mutex> lock(renderMutex);
    renderCondition.wait(lock, []{ return frameReady; });

    Napi::Buffer<unsigned char> buffer = Napi::Buffer<unsigned char>::Copy(info.Env(), frameBufferData.data(), frameBufferData.size());
    frameReady = false;
    lock.unlock();
    renderCondition.notify_one();

    return buffer;
}

Napi::Value StopRenderLoop(const Napi::CallbackInfo& info) {
    if (!initialized) {
        Napi::TypeError::New(info.Env(), "Render loop not started").ThrowAsJavaScriptException();
        return info.Env().Null();
    }

    {
        std::lock_guard<std::mutex> lock(renderMutex);
        stopRendering = true;
    }
    renderCondition.notify_one();
    renderThread.join();

    initialized = false;
    return info.Env().Undefined();
}

