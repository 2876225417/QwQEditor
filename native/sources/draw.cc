// draw.cc
#define WIN32_LEAN_AND_MEAN
#define NOGDI
#include <windows.h>
#include <GL/gl.h>
#include <GL/glu.h>
#include <GLFW/glfw3.h>
#include <napi.h>
#include <vector>
#include <cmath>

// 全局变量，用于存储旋转角度
static float rotationAngle = 0.0f;

Napi::Value Draw(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // 初始化 GLFW
    if (!glfwInit()) {
        Napi::TypeError::New(env, "Failed to initialize GLFW").ThrowAsJavaScriptException();
        return env.Null();
    }

    // 创建一个隐藏的窗口来初始化 OpenGL 上下文
    glfwWindowHint(GLFW_VISIBLE, GLFW_FALSE);  // 窗口隐藏
    GLFWwindow* window = glfwCreateWindow(800, 600, "Hidden OpenGL Window", NULL, NULL);
    if (!window) {
        glfwTerminate();
        Napi::TypeError::New(env, "Failed to create GLFW window").ThrowAsJavaScriptException();
        return env.Null();
    }

    // 绑定 OpenGL 上下文到当前线程
    glfwMakeContextCurrent(window);

    // 设置 OpenGL 绘制区域
    const int width = 800;
    const int height = 600;
    glViewport(0, 0, width, height);

    // 设置背景颜色
    glClearColor(0.1f, 0.2f, 0.3f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // 更新旋转角度
    rotationAngle += 1.0f; // 每次调用增加 1 度，调整速度可以改变旋转速度

    // 应用旋转
    glPushMatrix();
    glRotatef(rotationAngle, 0.0f, 0.0f, 1.0f); // 绕 z 轴旋转

    // 绘制一个彩色三角形
    glBegin(GL_TRIANGLES);
    glColor3f(1.0f, 0.0f, 0.0f); glVertex2f(-0.5f, -0.5f);
    glColor3f(0.0f, 1.0f, 0.0f); glVertex2f(0.5f, -0.5f);
    glColor3f(0.0f, 0.0f, 1.0f); glVertex2f(0.0f, 0.5f);
    glEnd();

    glPopMatrix(); // 恢复矩阵

    // 刷新缓冲区，确保所有 OpenGL 绘制指令执行完成
    glFlush();

    // 使用 glReadPixels 获取帧缓冲区数据
    std::vector<unsigned char> pixels(4 * width * height); // RGBA 格式
    glReadPixels(0, 0, width, height, GL_RGBA, GL_UNSIGNED_BYTE, pixels.data());

    // 关闭窗口并终止 GLFW
    glfwDestroyWindow(window);
    glfwTerminate();

    // 将像素数据返回给 JavaScript，作为 Uint8Array
    Napi::Buffer<unsigned char> buffer = Napi::Buffer<unsigned char>::Copy(env, pixels.data(), pixels.size());
    return buffer;
}



