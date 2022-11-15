from transformers import CLIPProcessor, CLIPModel
import torch
import torchvision
from torchvision.models import resnet50
import torchvision.transforms as transforms
import matplotlib.pyplot as plt
import numpy as np
import clip
from PIL import Image
import requests
import pickle

device = torch.device('cpu')
if torch.cuda.is_available():
    device = torch.device('cuda:0')  

with open('embeddings.pkl', 'rb') as f:
    embeddings = pickle.load(f)

stackembeddings = []

for i in range(10):
    stackembeddings.append(torch.cat(embeddings[i]))

stackembeddings = torch.cat(stackembeddings)

transform = transforms.Compose([
    transforms.Resize(224),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
])

model, preprocess = clip.load("ViT-B/32", device=device)
    
data_viz = torchvision.datasets.ImageFolder(
    "raw-img",
    transform=transform
)

def get_image(text):
    text=clip.tokenize(text).to(device)
    text_features = model.encode_text(text)
    scores = torch.einsum('ab, cb -> ac', stackembeddings, text_features)
    idx = torch.argmax(scores)
    pilImage = Image.fromarray((np.transpose(data_viz[idx][0], (1,2,0)).numpy() * 255).astype(np.uint8))
    pilImage.save('static/image.jpg')