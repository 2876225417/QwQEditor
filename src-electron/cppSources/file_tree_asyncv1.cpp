#include <napi.h>
#include <iostream>
#include <filesystem>
#include <chrono>  // 引入 chrono 库

namespace fs = std::filesystem;

// 定义一个异步任务类，继承 Napi::AsyncWorker
class FileTreeWorker : public Napi::AsyncWorker {
public:
    FileTreeWorker(const Napi::Env& env, const fs::path& path, Napi::Promise::Deferred deferred)
        : Napi::AsyncWorker(env), path(path), deferred(deferred) {}

    ~FileTreeWorker() {}

    // 执行耗时任务的函数
    void Execute() override {
        // 记录开始时间
        auto start = std::chrono::high_resolution_clock::now();

        try {
            // 递归构建文件树
            fileTree = CreateFileTree(path);
        } catch (const std::exception& e) {
            SetError(e.what());
        }

        // 记录结束时间
        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double> elapsed = end - start;
        std::cout << "Time taken to read the file tree (multi-threaded): " << elapsed.count() << " seconds" << std::endl;
    }

    // 执行完成后的回调函数
    void OnOK() override {
        Napi::Env env = Env();
        Napi::Object result = Napi::Object::New(env);
        result.Set("files", fileTree);
        deferred.Resolve(result);
    }

    void OnError(const Napi::Error& e) override {
        deferred.Reject(e.Value());
    }

    static Napi::Value Run(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();

        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expected a string as the first argument").ThrowAsJavaScriptException();
            return env.Null();
        }

        std::string directoryPath = info[0].As<Napi::String>();
        Napi::Promise::Deferred deferred = Napi::Promise::Deferred::New(env);

        // 创建并启动异步任务
        FileTreeWorker* worker = new FileTreeWorker(env, fs::path(directoryPath), deferred);
        worker->Queue();

        return deferred.Promise();
    }

private:
    fs::path path;
    Napi::Promise::Deferred deferred;
    Napi::Array fileTree;

    // 递归创建文件树的函数
    Napi::Array CreateFileTree(const fs::path& path) {
        Napi::Env env = Env();
        Napi::Array files = Napi::Array::New(env);

        if (fs::exists(path) && fs::is_directory(path)) {
            int index = 0;
            for (const auto& entry : fs::directory_iterator(path)) {
                Napi::Object fileInfo = Napi::Object::New(env);
                fileInfo.Set("name", entry.path().filename().string());
                fileInfo.Set("path", entry.path().string());

                if (fs::is_directory(entry.status())) {
                    fileInfo.Set("type", "directory");
                    fileInfo.Set("children", CreateFileTree(entry.path()));
                } else {
                    fileInfo.Set("type", "file");
                }

                files.Set(index++, fileInfo);
            }
        }

        return files;
    }
};

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("getFileTree", Napi::Function::New(env, FileTreeWorker::Run));
    return exports;
}

NODE_API_MODULE(file_tree, Init)
