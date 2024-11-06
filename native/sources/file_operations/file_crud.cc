

#include "file_operations/file_crud.h"
#include <napi.h>
#include <filesystem>
#include <fstream>
#include <string>

namespace fs = std::filesystem;

Napi::Value DeleteFile(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();

    if(info.Length() < 1 || !info[0].IsString()){
        Napi::TypeError::New(env, "File path expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string filePath = info[0].As<Napi::String>().Utf8Value();

    try{
        bool result = fs::remove(filePath);
        return Napi::Boolean::New(env, result);
    } catch (const fs::filesystem_error& e){
        Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
        return Napi::Boolean::New(env, false);
    }
}