#include <napi.h>
#include <iostream>

// 用于检查 C++ 标准版本的函数
void CheckCppStandard() {
    std::cout << "__cplusplus is: " << __cplusplus << std::endl;

    // 检查支持的 C++ 标准版本
    if (__cplusplus >= 202002L) {
        std::cout << "C++20 is supported!" << std::endl;
    } else if (__cplusplus >= 201703L) {
        std::cout << "C++17 is supported!" << std::endl;
    } else if (__cplusplus >= 201402L) {
        std::cout << "C++14 is supported!" << std::endl;
    } else if (__cplusplus >= 201103L) {
        std::cout << "C++11 is supported!" << std::endl;
    } else {
        std::cout << "C++11 or later is not supported." << std::endl;
    }
}

// 导出一个简单的 NAPI 函数来调用 CheckCppStandard
Napi::Value ShowCppStandard(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    CheckCppStandard();
    return Napi::String::New(env, "C++ standard check completed!");
}

// 初始化模块
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "showCppStandard"), Napi::Function::New(env, ShowCppStandard));
    return exports;
}

NODE_API_MODULE(addon, Init)
