# Converting and Quantizing Tarteel's Whisper Models

## Setup

clone whisper.cpp

```
$ git clone https://github.com/ggml-org/whisper.cpp.git
$ cd whisper.cpp
```

install `pip`

```
$ sudo apt install python3-pip
```

install a python virtual environment

```
$ sudo apt install python3.12-venv
$ python3 -m venv venv
$ source venv/bin/activate
```

install the python dependencies

```
$ pip install transformers torch 
```

install the offical OpenAI Whisper tool

```
$ pip install openai-whisper
```

copy the virtual location of the whisper tool

```
$ python -c "import whisper; print(whisper.__file__)" 

# usually this path:
# /home/<your_username>/Projects/whisper.cpp/venv/lib/python3.12/site-packages/whisper/__init__.py
```

download Tarteel's model repo inside `whisper.cpp/` from HuggingFace (no account needed)

```
$ pip install huggingface_hub
$ hf download tarteel-ai/whisper-tiny-ar-quran --local-dir models/tarteel-ai-whisper-tiny-ar-quran
```

## Converting

convert Tarteel's model from `pytorch` to `ggml` using the previously copied whisper tool path (don't forget the dot at the end or point it to a new directory you can make)

```
$ python models/convert-h5-to-ggml.py models/tarteel-ai-whisper-tiny-ar-quran/ /home/<your_username>/Projects/whisper.cpp/venv/lib/python3.12/site-packages .
```

afterwards check if the model is converted

```
$ ls ./*.bin

# usually named:
# ggml-model.bin
```

## Quantizing

install `cmake`

```
$ sudo apt install cmake
```

build the quantize tool

```
$ cmake -B build
$ cmake --build build -j --config Release
```

then quantize the model

```
$ ./build/bin/whisper-quantize ./ggml-model.bin ./tarteel-ai-whisper-tiny-ar-quran-ggml-q8_0.bin q8_0
```

afterwards check if the model is quantized

```
$ ls ./*.bin
```

wrap up with getting out of the python virtual environment

```
deactivate
```

## Other Models

you can convert and quantize other models (e.g. tarteel-ai/whisper-base-ar-quran)

go to `whisper.cpp/` folder

```
$ cd whisper.cpp
```

activate python virtual environment

```
$ source venv/bin/activate
```

download source model repo

```
$ hf download tarteel-ai/whisper-base-ar-quran --local-dir models/tarteel-ai-whisper-base-ar-quran
```

convert the model

```
$ python models/convert-h5-to-ggml.py models/tarteel-ai-whisper-base-ar-quran/ /home/<your_username>/Projects/whisper.cpp/venv/lib/python3.12/site-packages .
```

then quantize it

```
$ ./build/bin/whisper-quantize ./ggml-model.bin ./tarteel-ai-whisper-base-ar-quran-ggml-q8_0.bin q8_0
```

finally wrap up

```
deactivate
```

> NOTE: for converting multiple models, remember to rename the resulting `ggml-model.bin` file after conversion so when converting another it wont possibly overwrite the previous converted models