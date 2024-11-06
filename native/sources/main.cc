

#include <napi.h>
#include "envInfo.h"
#include "fileInfo.h"


Napi::Object Init(Napi::Env env, Napi::Object exports){
    exports.Set("getEnvInfo", Napi::Function::New(env, GetEnvInfo));
    exports.Set("getFileTreeJSON", Napi::Function::New(env, GetFileTreeJSON));
    return exports;
}

NODE_API_MODULE(envinfo, Init);

