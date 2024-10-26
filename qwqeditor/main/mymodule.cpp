#include <napi.h>
#include <string>

struct Person {
    std::string name;
    int age;
};

// 创建一个新的 `Person` 结构体实例
Napi::Object CreatePerson(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // 检查参数
    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsNumber()) {
        Napi::TypeError::New(env, "String and number expected").ThrowAsJavaScriptException();
    }

    // 从 JavaScript 参数获取值
    std::string name = info[0].As<Napi::String>();
    int age = info[1].As<Napi::Number>();

    // 创建 Person 实例
    Person* person = new Person{name, age};

    // 创建 JavaScript 对象并添加属性
    Napi::Object personObj = Napi::Object::New(env);
    personObj.Set("name", person->name);
    personObj.Set("age", person->age);

    return personObj;
}

// 导出模块
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "createPerson"), Napi::Function::New(env, CreatePerson));
    return exports;
}

NODE_API_MODULE(mymodule, Init)
