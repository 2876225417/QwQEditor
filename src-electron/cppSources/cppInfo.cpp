#include <napi.h>
#include <iostream>
#include <string>
#include <sstream>

// 获取 C++ 版本
std::string GetCppVersion() {
    std::ostringstream version;

    #if __cplusplus == 201103L
        version << "C++11";
    #elif __cplusplus == 201402L
        version << "C++14";
    #elif __cplusplus == 201703L
        version << "C++17";
    #elif __cplusplus >= 202002L
        version << "C++20";
    #else
        version << "Unknown or pre-C++11 version";
    #endif

    return version.str();
}

// 获取编译器信息
std::string GetCompilerInfo() {
    std::ostringstream compiler;

    #if defined(__clang__)
        compiler << "Clang/LLVM, version: " << __clang_version__;
    #elif defined(__GNUC__) || defined(__GNUG__)
        compiler << "GCC, version: " << __VERSION__;
    #elif defined(_MSC_VER)
        compiler << "Microsoft Visual Studio, version: " << _MSC_VER;
    #else
        compiler << "Unknown compiler";
    #endif

    return compiler.str();
}

// 获取系统信息
std::string GetSystemInfo() {
    #if defined(_WIN32)
        return "Windows";
    #elif defined(__APPLE__) || defined(__MACH__)
        return "Mac OSX";
    #elif defined(__linux__)
        return "Linux";
    #elif defined(__FreeBSD__)
        return "FreeBSD";
    #else
        return "Unknown OS";
    #endif
}

// 导出模块
Napi::Object GetCppInfo(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Object cppInfo = Napi::Object::New(env);

    cppInfo.Set("cppVersion", GetCppVersion());
    cppInfo.Set("compiler", GetCompilerInfo());
    cppInfo.Set("system", GetSystemInfo());

    return cppInfo;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("getCppInfo", Napi::Function::New(env, GetCppInfo));
    return exports;
}

NODE_API_MODULE(cpp_info_module, Init)
