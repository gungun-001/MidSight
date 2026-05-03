# 🔬 Project Report: MedSight AI Diagnostic Platform

## 1. Problem Statement & Importance
Skin diseases are among the most common human ailments, affecting billions worldwide. However, access to dermatologists is often limited, especially in rural or underserved regions. Delayed diagnosis of conditions like Eczema or Psoriasis can lead to severe complications and reduced quality of life.

**MedSight** addresses this gap by providing an AI-powered diagnostic tool that leverages Computer Vision to identify skin conditions from images. By providing instant feedback on disease type and severity, it serves as a preliminary screening tool to help users understand when to seek professional medical attention.

## 2. Model & Approach
The core of MedSight is a Deep Learning model based on the **MobileNetV2** architecture.

*   **Architecture**: MobileNetV2 was chosen for its efficiency and high performance on mobile and edge devices. It uses depthwise separable convolutions to reduce the number of parameters while maintaining accuracy.
*   **Transfer Learning**: We utilized a pre-trained MobileNetV2 (trained on ImageNet) as a feature extractor. This allowed the model to leverage general visual features (edges, textures) before being fine-tuned on specific dermatological data.
*   **Custom Classification Head**:
    *   Global Average Pooling
    *   Batch Normalization
    *   Dense Layers (256 and 128 units) with ReLU activation
    *   Dropout layers (0.4, 0.3) to prevent overfitting
    *   Softmax output layer for 4 classes
*   **Training Strategy**:
    *   **Phase 1**: Training only the custom head while freezing the MobileNetV2 backbone.
    *   **Phase 2**: Fine-tuning the top 30 layers of the backbone with a very low learning rate (1e-5) to adapt the model to skin textures.

## 3. Dataset
The model was trained using the **DermNet Dataset** (available on Kaggle). 

*   **Target Classes**: Acne, Eczema, Psoriasis, and Normal Skin.
*   **Preprocessing**:
    *   Resizing to 224x224 pixels.
    *   Data Augmentation: Random rotations, shifts, shears, zooms, horizontal flips, and brightness adjustments to ensure robustness against different lighting and angles.
    *   Synthetic Data: Normal skin samples were synthetically generated and augmented to balance the dataset where healthy skin samples were sparse.

## 4. Challenges Faced
*   **Class Imbalance**: Some skin conditions had significantly more samples than others. We addressed this through targeted data augmentation and synthetic sample generation for the "Normal" class.
*   **Visual Similarity**: Conditions like Eczema and Psoriasis can look visually similar to an untrained model. Fine-tuning the deeper layers of MobileNetV2 was critical to capturing the subtle texture differences.
*   **Deployment Constraints**: Ensuring the model remained lightweight enough for real-time web inference while maintaining high confidence scores.

## 5. Pipeline Explanation
The MedSight pipeline is designed for seamless user experience:

1.  **Input**: User uploads an image via the web interface or captures a live photo using their webcam.
2.  **Preprocessing**: The image is resized to 224x224 and normalized using MobileNetV2's specific preprocessing function (scaling pixels to the range [-1, 1]).
3.  **Model Inference**: The processed array is passed through the CNN. The model outputs a probability distribution across the four classes.
4.  **Post-processing**:
    *   The class with the highest probability is selected as the prediction.
    *   **Severity Logic**: Confidence scores are mapped to severity levels:
        *   < 50%: Mild
        *   50% - 75%: Moderate
        *   > 75%: Severe
5.  **Output**: The user receives a visual report showing the disease name, confidence percentage, severity level, and AI-generated advice from the integrated chatbot.

---
**Disclaimer**: *This project is for educational purposes only and is not a substitute for professional medical advice.*
