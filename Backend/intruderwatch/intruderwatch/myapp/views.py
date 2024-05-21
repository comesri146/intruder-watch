from django.shortcuts import render
from django.http import StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import MyModel
import cv2
import torch
import numpy as np
from django.shortcuts import redirect

def redirect_to_stream(request):
    return redirect('camera-stream')

# Path to the trained YOLOv5 model (.pt file)

PATH_TO_TRAINED_MODEL = "D:/Phase-2/final_model.pt"

# Load the YOLOv5 model
model = torch.hub.load("ultralytics/yolov5", "custom", path=PATH_TO_TRAINED_MODEL)

# Global storage for RoI coordinates
roi_regions = []

# Function to generate video frames
def generate_frames():
    #rtsp_url = "rtsp://admin:admin@192.168.90.151"
    rtsp_url = "rtsp://admin:admin@192.168.105.222"
    cap = cv2.VideoCapture(rtsp_url)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        

        frame_copy = frame.copy()

        # Perform detection in each ROI region
        for roi_start, roi_end in roi_regions:
            roi = frame[roi_start[1]:roi_end[1], roi_start[0]:roi_end[0]]
            detections = detect_objects_yolov5(roi)
            # Visualize the detections
            for _, row in detections.iterrows():
                # Convert ROI coordinates to frame coordinates
                xmin = roi_start[0] + int(row.xmin)
                ymin = roi_start[1] + int(row.ymin)
                xmax = roi_start[0] + int(row.xmax)
                ymax = roi_start[1] + int(row.ymax)
                # Draw bounding box and annotate
                cv2.rectangle(frame_copy, (xmin, ymin), (xmax, ymax), (0, 0, 255), 2)
                cv2.putText(frame_copy, f"{row.name}: {row.confidence:.2f}", 
                            (xmin, ymin - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

        # Encode the frame to JPEG
        ret, buffer = cv2.imencode('.jpg', frame_copy)
        if not ret:
            continue
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

    cap.release()
    cv2.destroyAllWindows()

def detect_objects_yolov5(image):
    results = model(image)
    return results.pandas().xyxy[0]

class RoIAPI(APIView):
    def get(self, request):
        # Return current RoI settings
        return Response(roi_regions)

    def post(self, request):
        try:
            roi_start = (int(request.data['x1']), int(request.data['y1']))
            roi_end = (int(request.data['x2']), int(request.data['y2']))
            roi_regions.append((roi_start, roi_end))
            return Response({"status": "RoI added"}, status=status.HTTP_201_CREATED)
        except (KeyError, TypeError, ValueError) as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

def camera_feed_endpoint(request):
    return StreamingHttpResponse(generate_frames(), content_type='multipart/x-mixed-replace; boundary=frame')

def camera_feed(request):
    return render(request, 'camera_feed.html', {})
