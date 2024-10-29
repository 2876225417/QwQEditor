#include <emscripten/emscripten.h>
#include <GLES2/gl2.h>
#include <iostream>

// 顶点着色器
const char* vertexShaderSource = R"(
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
)";

// 片段着色器
const char* fragmentShaderSource = R"(
    precision mediump float;
    uniform vec4 color;
    void main() {
        gl_FragColor = color;
    }
)";

GLuint program;
GLuint vao;

extern "C" {

// 初始化 WebGL 环境
void EMSCRIPTEN_KEEPALIVE init() {
    // 创建顶点着色器
    GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader, 1, &vertexShaderSource, nullptr);
    glCompileShader(vertexShader);

    // 创建片段着色器
    GLuint fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader, 1, &fragmentShaderSource, nullptr);
    glCompileShader(fragmentShader);

    // 链接着色器程序
    program = glCreateProgram();
    glAttachShader(program, vertexShader);
    glAttachShader(program, fragmentShader);
    glLinkProgram(program);

    // 删除着色器对象
    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);

    // 创建顶点缓冲区
    GLuint vbo;
    glGenBuffers(1, &vbo);
    glBindBuffer(GL_ARRAY_BUFFER, vbo);

    float vertices[] = {
        -0.5f, -0.5f,
         0.5f, -0.5f,
         0.0f,  0.5f
    };

    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    // 设置顶点数组
    GLint posAttrib = glGetAttribLocation(program, "position");
    glEnableVertexAttribArray(posAttrib);
    glVertexAttribPointer(posAttrib, 2, GL_FLOAT, GL_FALSE, 0, 0);
}

// 绘制三角形
void EMSCRIPTEN_KEEPALIVE drawTriangle() {
    glClear(GL_COLOR_BUFFER_BIT);

    // 使用着色器程序
    glUseProgram(program);

    // 设置颜色
    GLint colorUniform = glGetUniformLocation(program, "color");
    glUniform4f(colorUniform, 1.0f, 0.0f, 0.0f, 1.0f);

    // 绘制三角形
    glDrawArrays(GL_TRIANGLES, 0, 3);
}

}
