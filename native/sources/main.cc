

#include <napi.h>
#include "envInfo.h"

Napi::Object Init(Napi::Env env, Napi::Object exports){
    exports.Set("getEnvInfo", Napi::Function::New(env, GetEnvInfo));
    return exports;
}

NODE_API_MODULE(envinfo, Init);

