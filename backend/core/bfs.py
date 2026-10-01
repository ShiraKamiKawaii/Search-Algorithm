from collections import deque

def run_bfs(graph, start_node, goal_node):
    queue = deque([start_node])
    visited = {start_node}
    parent = {start_node: None}
    steps = []

    while queue:
        current = queue.popleft()

        # Lưu lại trạng thái từng bước để tạo animation ở frontend
        steps.append({
            "current": current,
            "open": list(queue),
            "closed": list(visited)
        })

        if current == goal_node:
            path = []
            curr = goal_node
            while curr is not None:
                path.append(curr)
                curr = parent[curr]
            path.reverse()
            return {
                "success": True,
                "path": path,
                "steps": steps
            }

        neighbors = graph.get(current, {}).get("neighbors", {})
        for neighbor in sorted(neighbors.keys()):
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = current
                queue.append(neighbor)

    return {
        "success": False,
        "path": [],
        "steps": steps
    }