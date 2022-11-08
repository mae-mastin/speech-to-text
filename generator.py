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
import json


def generate_score(data):


    device = torch.device('cpu')
    if torch.cuda.is_available():
        device = torch.device('cuda:0')    

    transform = transforms.Compose([
            transforms.Resize(224),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])

    data_viz = torchvision.datasets.ImageFolder(
        "Visualize",
        transform=transform
    )

    viz_loader =  torch.utils.data.DataLoader(
        data_viz,
        batch_size=1, 
    )

    model, preprocess = clip.load("ViT-B/32", device=device)

    text = clip.tokenize(data).to(device)
    image = preprocess(Image.open("ßgolden_retriever.jpg")).unsqueeze(0).to(device)

    logits_per_image, logits_per_text = model(image, text)
    probs = logits_per_image.softmax(dim=-1).detach().cpu().numpy()

    return probs