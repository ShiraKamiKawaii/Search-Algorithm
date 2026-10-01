import heapq

def run_best_first_search(graph, start_node, goal_node):
    open_set = []
    start_h = graph.get(start_node, {}).get("heuristic", 0)
    heapq.heappush(open_set, (start_h, start_node))

    visited = set()
    parent = {start_node: None}
    in_open = {start_node}
    steps = []

    while open_set:
        h_curr, current = heapq.heappop(open_set)
        in_open.remove(current)
        visited.add(current)

        # Định dạng tập OPEN hiển thị kèm heuristic: [["A", h_val], ...]
        open_list_repr = [[node, graph.get(node, {}).get("heuristic", 0)] for _, node in sorted(open_set)]
        
        steps.append({
            "current": current,
            "open": open_list_repr,
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
            if neighbor not in visited and neighbor not in in_open:
                parent[neighbor] = current
                h_val = graph.get(neighbor, {}).get("heuristic", 0)
                heapq.heappush(open_set, (h_val, neighbor))
                in_open.add(neighbor)

    return {
        "success": False,
        "path": [],
        "steps": steps
    }