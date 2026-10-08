import cv2, os, glob

# Let's check frames in scratch/frames_205540 and scratch/frames_225949 and scratch/frames_005432
for folder in ['scratch/frames_205540', 'scratch/frames_225949', 'scratch/frames_005432']:
    if os.path.exists(folder):
        print(folder, len(os.listdir(folder)))
