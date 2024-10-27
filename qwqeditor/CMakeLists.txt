


cmake_minimum_required(VERSION 3.25)
project(qwqeditor)

set(CMAKE_CXX_STANDARD 11)

find_path(NODE_INCLUDE_DIR node/node.h)
find_library(NODE_LIBRARY node)


add_subdirectory(node_modules/node-addon-api EXCLUDE_FROM_ALL)

add_library(mymodule SHARED main/mymodule.cpp)

