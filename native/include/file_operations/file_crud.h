



#ifndef FILE_CRUD_H
#define FILE_CURD_H

#include <napi.h>

// Napi::Value CreateFile(const Napi::CallbackInfo& info);
// Napi::Value ReadFile(const Napi::CallbackInfo& info);
// Napi::Value WriteFile(const Napi::CallbackInfo& info);
Napi::Value DeleteFile(const Napi::CallbackInfo& info);

#endif  // FILE_CRUD_H