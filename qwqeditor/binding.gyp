{
  "targets": [
    {
      "target_name": "triangle",
      "sources": ["main/cppInter/triangle.cpp"],
      "include_dirs": [
        "C:/Users/28762/WebstormProjects/qwqeditor/node_modules/node-addon-api",
        "C:/Users/28762/WebstormProjects/qwqeditor/exterLibs/glew/include",
        "C:/Users/28762/WebstormProjects/qwqeditor/exterLibs/glfw64/include"
      ],
      "libraries": [
         "C:/Users/28762/WebstormProjects/qwqeditor/exterLibs/glew/lib/Release/x64/glew32.lib",
         "C:/Users/28762/WebstormProjects/qwqeditor/exterLibs/glfw/lib-vc2022/glfw3.lib",

      ],
      "defines": [
        "GLEW_STATIC"
      ],
      "cflags_cc": ["-std=c++11"],
      "defines": ["NAPI_VERSION=3", "NAPI_CPP_EXCEPTIONS"]
    }
  ]
}
