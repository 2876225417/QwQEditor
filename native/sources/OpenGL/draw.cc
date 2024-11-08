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
#include <random>
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
static float M_PI = 3.14159;


// 定义雨滴结构
struct Raindrop {
    float x, y;        // 雨滴位置
    float speed;       // 雨滴速度
};

std::vector<Raindrop> raindrops;

// 初始化雨滴
void InitializeRaindrops(int count) {
    raindrops.clear();
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<float> xDist(-1.0f, 1.0f);
    std::uniform_real_distribution<float> yDist(0.5f, 1.5f);
    std::uniform_real_distribution<float> speedDist(0.01f, 0.03f);

    for (int i = 0; i < count; ++i) {
        raindrops.push_back({ xDist(gen), yDist(gen), speedDist(gen) });
    }
}

// 初始化帧缓冲对象 (FBO)
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

// 绘制月亮效果
void DrawMoon() {
    // 设置月亮的位置和半径
    float moonX = -0.8f;
    float moonY = 0.8f;
    float maxRadius = 0.15f;

    // 绘制多个半径的同心圆，以模拟月亮的光晕
    glBegin(GL_TRIANGLE_FAN);
    for (float radius = maxRadius; radius > 0.01f; radius -= 0.02f) {
        float alpha = (radius / maxRadius) * 0.5f;  // 根据半径调整透明度
        glColor4f(1.0f, 1.0f, 0.9f, alpha); // 淡白色，透明度渐变

        // 绘制圆形的顶点
        for (int angle = 0; angle <= 360; angle += 10) {
            float rad = angle * M_PI / 180.0f;
            glVertex2f(moonX + cos(rad) * radius, moonY + sin(rad) * radius);
        }
    }
    glEnd();
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

    // 初始化雨滴数量
    InitializeRaindrops(100);  // 生成 100 个雨滴

    while (true) {
        std::unique_lock<std::mutex> lock(renderMutex);
        renderCondition.wait(lock, []{ return !frameReady || stopRendering; });

        if (stopRendering) break;

        glBindFramebuffer(GL_FRAMEBUFFER, fbo);
        glViewport(0, 0, width, height);
        glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        // 绘制月亮
        DrawMoon();

        // 动态更新旋转角度
        rotationAngle += 1.0f;

        // 动态生成颜色
        float red = (sin(rotationAngle * 0.1f) + 1.0f) / 2.0f;
        float green = (sin(rotationAngle * 0.2f + 1.0f) + 1.0f) / 2.0f;
        float blue = (sin(rotationAngle * 0.3f + 2.0f) + 1.0f) / 2.0f;

        glPushMatrix();
        glRotatef(rotationAngle, 0.0f, 0.0f, 1.0f);

        // 绘制三角形，并动态设置颜色
        glBegin(GL_TRIANGLES);
        glColor3f(red, 0.0f, 1.0f - red); glVertex2f(-0.5f, -0.5f);
        glColor3f(0.0f, green, 1.0f - green); glVertex2f(0.5f, -0.5f);
        glColor3f(blue, 0.0f, 1.0f - blue); glVertex2f(0.0f, 0.5f);
        glEnd();

        glPopMatrix();

        // 更新并绘制雨滴
        glBegin(GL_LINES);
        glColor3f(0.5f, 0.5f, 1.0f); // 雨滴颜色
        for (auto& drop : raindrops) {
            glVertex3f(drop.x, drop.y, -1.0f);             // 雨滴起点
            glVertex3f(drop.x, drop.y - 0.1f, -1.0f);      // 雨滴终点
            drop.y -= drop.speed;
            if (drop.y < -1.0f) {
                drop.y = 1.0f;
            }
        }
        glEnd();

        glFlush();

        // 读取帧缓冲数据
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

