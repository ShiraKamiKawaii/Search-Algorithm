import os

def parse_input_file(filepath):
    """
    Đọc file input .txt và trả về (start_node, goal_node, graph)
    Định dạng đồ thị:
    {
        "A": {"heuristic": 10, "neighbors": {"B": 2, "C": 4}},
        "B": {"heuristic": 8,  "neighbors": {"D": 5}}
    }
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Không tìm thấy file: {filepath}")

    start_node = None
    goal_node = None
    graph = {}
    mode = None

    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            parts = line.split()
            cmd = parts[0].upper()

            if cmd == 'START':
                start_node = parts[1]
            elif cmd == 'GOAL':
                goal_node = parts[1]
            elif cmd in ['HEURISTIC', 'HEURISTICS']:
                mode = 'HEURISTIC'
            elif cmd in ['EDGES', 'GRAPH']:
                mode = 'EDGES'
            else:
                if mode == 'HEURISTIC':
                    node, h_val = parts[0], float(parts[1])
                    if node not in graph:
                        graph[node] = {"heuristic": h_val, "neighbors": {}}
                    else:
                        graph[node]["heuristic"] = h_val

                elif mode == 'EDGES':
                    u, v = parts[0], parts[1]
                    weight = float(parts[2]) if len(parts) > 2 else 1.0
                    
                    if u not in graph:
                        graph[u] = {"heuristic": 0.0, "neighbors": {}}
                    if v not in graph:
                        graph[v] = {"heuristic": 0.0, "neighbors": {}}
                        
                    graph[u]["neighbors"][v] = weight

    return start_node, goal_node, graph