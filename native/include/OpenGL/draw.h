// draw.h
#ifndef DRAW_H
#define DRAW_H

#include <napi.h>

// Napi::Value Draw(const Napi::CallbackInfo& info);
Napi::Value StartRenderLoop(const Napi::CallbackInfo& info);
Napi::Value GetFrame(const Napi::CallbackInfo& info);
Napi::Value StopRenderLoop(const Napi::CallbackInfo& info);





#endif // DRAW_H
