#include <napi.h>
#include <string>
#include <thread>

// 示例函数：在新线程中运行的任务
void LongRunningTask(Napi::FunctionReference* callbackRef) {
    // 模拟一个长时间运行的任务（5秒）
    std::this_thread::sleep_for(std::chrono::seconds(5));

    // 在任务完成后调用回调
    Napi::Env env = callbackRef->Env();
    callbackRef->Call({Napi::String::New(env, "Task completed!")});

    // 释放回调引用
    delete callbackRef;
}

// 启动一个多线程任务
void StartThread(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // 检查参数是否为一个函数
    if (info.Length() < 1 || !info[0].IsFunction()) {
        Napi::TypeError::New(env, "Function expected").ThrowAsJavaScriptException();
        return;
    }

    // 创建回调函数引用
    Napi::Function callback = info[0].As<Napi::Function>();
    Napi::FunctionReference* callbackRef = new Napi::FunctionReference();
    *callbackRef = Napi::Persistent(callback);

    // 启动新线程并运行任务
    std::thread t(LongRunningTask, callbackRef);
    t.detach(); // 分离线程，使其在后台运行
}

// 导出模块
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "startThread"), Napi::Function::New(env, StartThread));
    return exports;
}

NODE_API_MODULE(mymodule, Init)
