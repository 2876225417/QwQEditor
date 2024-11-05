#include <napi.h>
#include <iostream>
#include <filesystem>
#include <vector>
#include <thread>
#include <mutex>
#include <chrono>  // 引入chrono库

namespace fs = std::filesystem;

// 用于同步对共享资源的访问
std::mutex mtx;

// 递归创建文件树的函数声明
Napi::Object createFileTree(const Napi::Env& env, const fs::path& path);

void processDirectory(const Napi::Env& env, const fs::path& path, Napi::Array& files, int& index) {
    try {
        for (const auto& entry : fs::directory_iterator(path)) {
            Napi::Object fileInfo = Napi::Object::New(env);
            fileInfo.Set("name", entry.path().filename().string());
            fileInfo.Set("path", entry.path().string());

            if (fs::is_directory(entry.status())) {
                fileInfo.Set("type", "directory");

                // 创建一个空的子树
                Napi::Array children = Napi::Array::New(env);
                std::thread childThread([env, entry, &children]() {
                    Napi::Object subtree = createFileTree(env, entry.path());
                    std::lock_guard<std::mutex> lock(mtx);
                    children = subtree.Get("files").As<Napi::Array>();
                });
                childThread.join();

                fileInfo.Set("children", children);
            } else {
                fileInfo.Set("type", "file");
            }

            // 更新共享资源时使用互斥锁
            std::lock_guard<std::mutex> lock(mtx);
            files.Set(index++, fileInfo);
        }
    } catch (const std::exception& e) {
        Napi::TypeError::New(env, e.what()).ThrowAsJavaScriptException();
    }
}

Napi::Object createFileTree(const Napi::Env& env, const fs::path& path) {
    Napi::Object fileTree = Napi::Object::New(env);

    if (fs::exists(path) && fs::is_directory(path)) {
        Napi::Array files = Napi::Array::New(env);
        int index = 0;

        // 记录开始时间
        auto start = std::chrono::high_resolution_clock::now();

        // 创建一个线程来处理该目录
        std::thread mainThread(processDirectory, env, path, std::ref(files), std::ref(index));
        mainThread.join();  // 等待主线程完成

        // 记录结束时间
        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double> elapsed = end - start;

        // 输出花费的时间
        std::cout << "Time taken to read the file tree: " << elapsed.count() << " seconds" << std::endl;

        fileTree.Set("files", files);
    }

    return fileTree;
}

Napi::Value GetFileTree(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "Expected a string as the first argument").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string directoryPath = info[0].As<Napi::String>();
    return createFileTree(env, fs::path(directoryPath));
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("getFileTree", Napi::Function::New(env, GetFileTree));
    return exports;
}

NODE_API_MODULE(file_tree, Init)
