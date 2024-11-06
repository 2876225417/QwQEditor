cmake_minimum_required(VERSION 3.15)

project(Modules)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

if(MSVC)
  add_compile_options(/std:c++20 /Zc:__cplusplus)
endif()

# 需要编译的文件
file(GLOB_RECURSE SOURCE_FILES
    "${CMAKE_SOURCE_DIR}/native/sources/*.cc"
    "${CMAKE_SOURCE_DIR}/native/sources/*.h"
    "${CMAKE_SOURCE_DIR}/native/sources/*.hpp"
    "${CMAKE_SOURCE_DIR}/native/sources/*.cpp"
    "${CMAKE_SOURCE_DIR}/native/sources/*.c"
    "${CMAKE_SOURCE_DIR}/native/include/*.c"
    "${CMAKE_SOURCE_DIR}/native/include/*.cpp"
    "${CMAKE_SOURCE_DIR}/native/include/*.cc"
    "${CMAKE_SOURCE_DIR}/native/include/*.hpp"
    "${CMAKE_SOURCE_DIR}/native/include/*.h"
)

# 构建为共享库，输出文件名为".node"
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# 添加 node-addon-api 的包含路径
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC})
target_include_directories(${PROJECT_NAME} PRIVATE "${CMAKE_SOURCE_DIR}/node_modules/node-addon-api")
target_include_directories(${PROJECT_NAME} PRIVATE "${CMAKE_SOURCE_DIR}/native/extLibs")
target_include_directories(${PROJECT_NAME} PRIVATE "${CMAKE_SOURCE_DIR}/native/include")



target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})


# 将编译生成的文件(Debug或Release)复制到native/build文件夹中
set(OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/native/build/$<CONFIG>")
set(RELEASE_DIRECTORY "${CMAKE_BINARY_DIR}/Release")

add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    "${RELEASE_DIRECTORY}"
    "${OUTPUT_DIRECTORY}"
)