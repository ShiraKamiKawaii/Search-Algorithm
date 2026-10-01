import os
import shutil
from typing import Optional
from fastapi import FastAPI, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from core.parser import parse_input_file
from core.bfs import run_bfs
from core.best_first_search import run_best_first_search
from core.a_star import run_a_star

app = FastAPI(title="Graph Algorithm Visualizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

INPUT_DIR = os.path.join(os.path.dirname(__file__), "inputs")
TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp")
os.makedirs(TEMP_DIR, exist_ok=True)

@app.post("/api/solve")
async def solve_algorithm(
    algo: str = Form(...),
    file: Optional[UploadFile] = Form(None),
    custom_start: Optional[str] = Form(None),
    custom_goal: Optional[str] = Form(None)
):
    temp_file_path = None
    try:
        # Nếu có file upload từ client
        if file and hasattr(file, 'filename') and file.filename:
            temp_file_path = os.path.join(TEMP_DIR, file.filename)
            with open(temp_file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            file_path = temp_file_path
        else:
            file_map = {
                "BFS": "input_bfs.txt",
                "Best First Search": "input_best_first.txt",
                "A*": "input_a_star.txt"
            }
            file_name = file_map.get(algo, "input_best_first.txt")
            file_path = os.path.join(INPUT_DIR, file_name)

            if not os.path.exists(file_path):
                available = [f for f in os.listdir(INPUT_DIR) if f.endswith('.txt')]
                if available:
                    file_path = os.path.join(INPUT_DIR, available[0])
                else:
                    raise HTTPException(status_code=404, detail="Không tìm thấy file dữ liệu.")

        # Đọc nội dung thô của file để gửi về Frontend hiển thị
        with open(file_path, "r", encoding="utf-8") as f:
            file_content = f.read()

        parsed_start, parsed_goal, graph = parse_input_file(file_path)

        # Sử dụng đỉnh đầu / đích do người dùng tùy chỉnh nếu có
        start_node = custom_start.strip().upper() if custom_start and custom_start.strip() else parsed_start
        goal_node = custom_goal.strip().upper() if custom_goal and custom_goal.strip() else parsed_goal

        if start_node not in graph:
            raise HTTPException(status_code=400, detail=f"Đỉnh đầu '{start_node}' không có trong đồ thị.")
        if goal_node not in graph:
            raise HTTPException(status_code=400, detail=f"Đỉnh đích '{goal_node}' không có trong đồ thị.")

        if algo == "BFS":
            result = run_bfs(graph, start_node, goal_node)
        elif algo == "Best First Search":
            result = run_best_first_search(graph, start_node, goal_node)
        elif algo == "A*":
            result = run_a_star(graph, start_node, goal_node)
        else:
            raise HTTPException(status_code=400, detail="Thuật toán không hợp lệ")

        return {
            "algo": algo,
            "start": start_node,
            "goal": goal_node,
            "graph": graph,
            "result": result,
            "file_content": file_content
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)