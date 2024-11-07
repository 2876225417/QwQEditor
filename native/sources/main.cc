

#include <napi.h>
#include "env/envInfo.h"
#include "file_operations/fileInfo.h"
#include "file_operations/file_crud.h"
#include "draw.h"


Napi::Object Init(Napi::Env env, Napi::Object exports){
    exports.Set("getEnvInfo", Napi::Function::New(env, GetEnvInfo));
    exports.Set("getFileTreeJSON", Napi::Function::New(env, GetFileTreeJSON));
    exports.Set("deleteFile", Napi::Function::New(env, DeleteFile));
    exports.Set("draw", Napi::Function::New(env, Draw));
    return exports;
}

NODE_API_MODULE(envinfo, Init);

