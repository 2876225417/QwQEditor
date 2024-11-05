#include <napi.h>
#include <iostream>
#include <filesystem>
#include <chrono>  // 引入chrono库

namespace fs = std::filesystem;

// 递归创建文件树的函数
Napi::Object createFileTree(const Napi::Env& env, const fs::path& path) {
    Napi::Object fileTree = Napi::Object::New(env);

    if (fs::exists(path) && fs::is_directory(path)) {
        Napi::Array files = Napi::Array::New(env);
        int index = 0;

        // 记录开始时间
        auto start = std::chrono::high_resolution_clock::now();

        try {
            for (const auto& entry : fs::directory_iterator(path)) {
                Napi::Object fileInfo = Napi::Object::New(env);
                fileInfo.Set("name", entry.path().filename().string());
                fileInfo.Set("path", entry.path().string());

                if (fs::is_directory(entry.status())) {
                    fileInfo.Set("type", "directory");
                    fileInfo.Set("children", createFileTree(env, entry.path()));
                } else {
                    fileInfo.Set("type", "file");
                }

                files.Set(index++, fileInfo);
            }
        } catch (const std::exception& e) {
            Napi::TypeError::New(env, e.what()).ThrowAsJavaScriptException();
        }

        // 记录结束时间
        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double> elapsed = end - start;

        // 输出花费的时间
        std::cout << "Time taken to read the file tree (single-threaded): " << elapsed.count() << " seconds" << std::endl;

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
