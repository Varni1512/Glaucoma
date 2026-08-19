# Automated Glaucoma Classification using IEMD and Ensemble Learning.

A machine learning pipeline for automated binary classification of glaucoma from retinal fundus images, using Image Empirical Mode Decomposition (IEMD) and a soft-voting ensemble classifier.

---

## Overview

Glaucoma is the second leading cause of permanent blindness worldwide. This project presents a computer-aided diagnosis (CAD) system that classifies retinal fundus images as **healthy** or **glaucomatous** using a combination of signal decomposition, multi-source feature extraction, and ensemble learning.

> **Dataset**: RIM-ONE r12 (505 images — 255 healthy, 250 glaucomatous)  
> **Best Accuracy**: 89.43%  
> **Best Specificity**: 94.85%

---

## Pipeline

```
Raw Fundus Image
      │
      ▼
 Preprocessing
 (Resize → Green Channel → CLAHE → Unsharp Mask)
      │
      ▼
 Image Empirical Mode Decomposition (IEMD)
 (3 IMFs + 1 Residue)
      │
      ▼
 Feature Extraction (from IMFs + Full Image + Optic Disc Crop)
 ├── GLCM Texture Features
 ├── Entropy (Shannon, Rényi, Kapur, Yager)
 ├── Local Binary Patterns (LBP)
 ├── Histogram of Oriented Gradients (HOG)
 └── Gabor Filter Responses
      │
      ▼
 Feature Normalisation (Z-score)
      │
      ▼
 ANOVA Feature Selection (Top 100) → PCA (40 components)
      │
      ▼
 Soft-Voting Ensemble Classifier
 ├── SVM (RBF Kernel)
 ├── Random Forest (300 trees)
 └── Gradient Boosting (150 estimators)
      │
      ▼
 Binary Classification: Healthy / Glaucoma
```

---

## Results

| Metric      | Score          |
|-------------|----------------|
| Accuracy    | 89.43 ± 1.33%  |
| Sensitivity | 79.51 ± 3.52%  |
| Specificity | 94.85 ± 1.69%  |

### Comparison with State-of-the-Art (RIM-ONE r12)

| Method                          | Accuracy (%) |
|---------------------------------|--------------|
| Maheshwari et al. (EWT)         | 80.66        |
| Kirar et al. (DWT+EWT)          | 83.60        |
| Agrawal et al. (QBVMD)          | 86.13        |
| Parashar & Agrawal (FAWT)       | 90.76        |
| **Proposed (Ensemble)**         | **89.43**    |



---

## Installation

```bash
git clone https://github.com/Varni1512/Glaucoma.git
cd glaucoma
pip install -r requirements.txt
```

---

## Requirements

```
numpy
opencv-python
scikit-learn
scikit-image
scipy
matplotlib
pandas
```

---

## Dataset

This project uses the **RIM-ONE r12** database, a publicly available retinal fundus image dataset.

Download it from: [http://medimrg.webs.ull.es/](http://medimrg.webs.ull.es/)

Place the images under `data/rim_one_r12/` with subfolders:
```
data/rim_one_r12/
├── healthy/
└── glaucoma/
```

---

## Authors

- **Varni Patel** — Department of CSE, VIT Bhopal  

---

## Acknowledgements

Thanks to the **Medical Image Analysis Group (MIAG)** for maintaining open access to the RIM-ONE retinal image database.

---

## License

This project is for academic and research purposes only.
