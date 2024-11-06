

#include "envInfo.h"


#if defined(_WIN32)
    #define OS_NAME "Windows"
#elif defined(__APPLE__) || defined(__MACH__)
    #define OS_NAME "macOS"
#elif defined(__linux__)
    #define OS_NAME "Linux"
#else
    #define OS_NAME "Unknown"
#endif


Napi::Object GetEnvInfo(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();
    Napi::Object envInfo = Napi::Object::New(env);

    envInfo.Set("cplusplus", __cplusplus);
    if(__cplusplus >= 202002L)
        envInfo.Set("cppStandard", "C++20");
    else if(__cplusplus >= 201703L)
        envInfo.Set("cppStandard", "C++17");
    else if(__cplusplus >= 201402L)
        envInfo.Set("cppStandard", "C++14");
    else if(__cplusplus >= 201103L)
        envInfo.Set("cppStandard", "C++11");
    else
        envInfo.Set("cppStandard", "Pre-C++11");

    envInfo.Set("os", OS_NAME);

    return envInfo;
}




