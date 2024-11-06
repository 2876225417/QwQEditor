cmake_minimum_required(VERSION 3.15)  # 更新为更高的版本

# 项目名称
project(addon)

# 设置 C++ 标准为 C++20，并强制要求使用该标准
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# 添加编译选项，特别是在使用 MSVC 编译器时
if(MSVC)
  add_compile_options(/std:c++20 /Zc:__cplusplus)  # 强制 MSVC 使用 C++20
endif()

# 从 `native` 文件夹中构建共享库
file(GLOB SOURCE_FILES "native/*.cc" "native/*.h")
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})

# 设置库文件的前缀和后缀
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# 必须包含的头文件路径
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC})
target_include_directories(${PROJECT_NAME} PRIVATE "${CMAKE_SOURCE_DIR}/node_modules/node-addon-api")

# 必须链接的库文件
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})
