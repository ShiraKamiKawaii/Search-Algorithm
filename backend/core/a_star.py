import heapq

def run_a_star(graph, start_node, goal_node):
    g_score = {start_node: 0}
    h_start = graph.get(start_node, {}).get("heuristic", 0)
    f_score = {start_node: h_start}

    open_set = []
    heapq.heappush(open_set, (f_score[start_node], start_node))

    parent = {start_node: None}
    closed_set = set()
    steps = []

    while open_set:
        f_curr, current = heapq.heappop(open_set)

        if current in closed_set:
            continue

        closed_set.add(current)

        # Định dạng tập OPEN hiển thị kèm f(n)
        open_list_repr = [[node, f_score.get(node, 0)] for f, node in sorted(open_set) if node not in closed_set]

        steps.append({
            "current": current,
            "open": open_list_repr,
            "closed": list(closed_set)
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
                "cost": g_score[goal_node],
                "steps": steps
            }

        neighbors = graph.get(current, {}).get("neighbors", {})
        for neighbor, weight in neighbors.items():
            tentative_g = g_score[current] + weight

            if neighbor not in g_score or tentative_g < g_score[neighbor]:
                parent[neighbor] = current
                g_score[neighbor] = tentative_g
                h_val = graph.get(neighbor, {}).get("heuristic", 0)
                f_score[neighbor] = tentative_g + h_val
                heapq.heappush(open_set, (f_score[neighbor], neighbor))

    return {
        "success": False,
        "path": [],
        "steps": steps
    }