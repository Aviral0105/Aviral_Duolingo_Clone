import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/avira/.gemini/antigravity/brain/caa4d242-f6c2-4a59-b39f-4aa7b68336d8/.system_generated/logs/transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        si = data.get('step_index', 0)
        if si == 744 or si == 866:
            print(f"=== STEP {si} ===")
            print((data.get('content') or '')[:3000])
