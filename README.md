# 🧠 AI-Powered Communication App for Specially Abled Children

This project is an **AI-powered communication app** designed to help **specially abled children** express their thoughts, emotions, and needs using intuitive visuals and intelligent language generation.

By using **Gemini AI** and **Firebase**, this app enables children to communicate more effectively through images and video-based behavior analysis, giving parents or caregivers real-time insights into the child's emotional or behavioral state.

---

## 🚀 Features

### 🖼️ Image-Based Communication
- Children **tap on an image**, and the **Gemini API** generates a complete sentence based on the image.
- Example: Tapping on a picture of food might generate:  
  > _"I'm feeling hungry and would like to eat something."_

### 🎥 Behavior Analysis (Video Input)
- Parents can upload or record a **video of the child**.
- The app analyzes the video using Gemini to understand **behavioral cues**.
- Generates insights such as:  
  > _"The child appears anxious or overstimulated."_  

### 🔔 Real-Time Notification (Optional Advanced Feature)
- When a child performs an action (like tapping an image or expressing intent), a **push notification** can be sent to the parent using Firebase Cloud Messaging (FCM).
- Keeps parents immediately informed about the child's needs.

---

## 🧠 Technologies Used

| Tech | Purpose |
|------|--------|
| 🔥 Firebase Studio | UI development, Firestore, and prototyping |
| 🧠 Gemini API (Google AI) | Image → Text and Video → Behavior analysis |
| ☁️ Firebase Cloud Functions (optional) | Trigger notifications |
| 📲 Firebase Cloud Messaging (optional) | Real-time alerts for parents |
| 🛠️ Firebase Firestore | Storing interpreted messages and history |

---


---

## 🧪 How It Works

1. **Child taps on an image**
2. Image is sent to **Gemini API**
3. Gemini returns a meaningful sentence
4. Sentence is stored in **Firebase Firestore**
5. (Optional) A **notification** is sent to the parent’s device
6. **Video analysis** feature allows the parent to upload a video for Gemini to interpret behavior

---

## 🧩 Use Case Example

| Action | Output |
|--------|--------|
| Child taps image of a park | _"I want to go outside and play."_ |
| Video shows child pacing repeatedly | _"The child may be feeling anxious."_ |

---


