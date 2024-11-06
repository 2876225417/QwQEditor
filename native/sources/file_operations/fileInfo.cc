#include "file_operations/fileInfo.h"
#include <filesystem>
#include "json.hpp"
#include <iostream>
#include <stack>
#include <codecvt>
#include <locale>
#include <chrono>
#include <napi.h>

namespace fs = std::filesystem;
using json = nlohmann::json;

// 辅助函数：将文件名转换为 UTF-8
std::string to_utf8(const std::wstring& wstr) {
    try {
        std::wstring_convert<std::codecvt_utf8<wchar_t>> conv;
        return conv.to_bytes(wstr);
    } catch (...) {
        return "[Invalid UTF-8]";
    }
}

// 单线程非递归的文件树构建函数
json getFileTreeIterative(const fs::path& rootDir) {
    json result;
    result["type"] = "directory";
    result["name"] = to_utf8(rootDir.filename().wstring());
    result["children"] = json::array();

    std::stack<std::pair<fs::path, json*>> dirStack;
    dirStack.push({rootDir, &result["children"]});

    while (!dirStack.empty()) {
        auto [currentDir, parentJsonArray] = dirStack.top();
        dirStack.pop();

        json children_array = json::array();

        try {
            for (const auto& entry : fs::directory_iterator(currentDir, fs::directory_options::skip_permission_denied)) {
                json child;

                try {
                    auto entryPath = entry.path();
                    if (fs::is_directory(entryPath)) {
                        child["type"] = "directory";
                        child["name"] = to_utf8(entryPath.filename().wstring());
                        child["children"] = json::array();

                        dirStack.push({entryPath, &child["children"]});
                    } else if (fs::is_regular_file(entryPath)) {
                        child["type"] = "file";
                        child["name"] = to_utf8(entryPath.filename().wstring());
                    } else {
                        child["type"] = "unknown";
                        child["name"] = to_utf8(entryPath.filename().wstring());
                    }

                    children_array.push_back(child);

                } catch (const std::exception& e) {
                    std::cerr << "Error processing entry: " << entry.path() << " - " << e.what() << '\n';
                    continue;
                }
            }

            *parentJsonArray = std::move(children_array);

        } catch (const fs::filesystem_error& e) {
            std::cerr << "Error reading directory: \"" << currentDir.string() << "\" - " << e.what() << '\n';
        }
    }

    return result;
}

// N-API 函数：返回文件树 JSON
Napi::Value GetFileTreeJSON(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "Path expected as string").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string userPath = info[0].As<Napi::String>().Utf8Value();
    std::cout << "User path received: " << userPath << '\n';
    fs::path dirPath(userPath);

    try {
        auto start = std::chrono::high_resolution_clock::now();
        json fileTree = getFileTreeIterative(dirPath);
        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double> duration = end - start;
        std::cout << "Execution time: " << duration.count() << " seconds\n";

        return Napi::String::New(env, fileTree.dump(2));
    } catch (const fs::filesystem_error& e) {
        Napi::TypeError::New(env, "Error reading directory: " + std::string(e.what())).ThrowAsJavaScriptException();
        return env.Null();
    } catch (const std::exception& e) {
        Napi::TypeError::New(env, "General error: " + std::string(e.what())).ThrowAsJavaScriptException();
        return env.Null();
    }
}



