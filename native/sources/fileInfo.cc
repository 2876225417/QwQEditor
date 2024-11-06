



#include "fileInfo.h"
#include <filesystem>
#include "../extLibs/json.hpp"

namespace fs = std::filesystem;
using json = nlohmann::json;

json getFileTree(const fs::path& dirPath){
    json result;

    if(fs::is_directory(dirPath)){
        result["type"] = "directory";
        result["name"] = dirPath.filename().string();
        result["children"] = json::array();

        for(const auto& entry : fs::directory_iterator(dirPath))
            result["children"].push_back(getFileTree(entry.path()));
    }else if(fs::is_regular_file(dirPath)){
        result["type"] = "file";
        result["name"] = dirPath.filename().string();
    }else{
        result["type"] = "unknown";
        result["name"] = dirPath.filename().string();
    }
}

Napi::Value GetFileTreeJSON(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();

    if(info.Length() < 1 || info[0].IsString()){
        Napi::TypeError::New(env, "Path expected as string").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string userPath = info[0].As<Napi::String>().Utf8Value();
    fs::path dirPath(userPath);

    try{
        json fileTree = getFileTree(dirPath);
        return Napi::String::New(env, fileTree.dump(2));
    } catch(const fs::filesystem_error& e){
        Napi::TypeError::New(env, "Error reading directory: " + std::string(e.what())).ThrowAsJavaScriptException();
        return env.Null();
    }
}