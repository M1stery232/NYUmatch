import networkx as nx
import random
from community import community_louvain


N = 200
num_clusters = 4
weeks = 12

intra_cluster_prob = 0.8

nyumatch_outside_prob = 0.8


students = list(range(N))
clusters = [[] for _ in range(num_clusters)]
for s in students:
    cluster_id = random.randint(0, num_clusters - 1)
    clusters[cluster_id].append(s)


student_cluster = {}
for cid, c_members in enumerate(clusters):
    for m in c_members:
        student_cluster[m] = cid

def measure_modularity(G):
    if G.number_of_edges() == 0:
        return 0.0
    partition = community_louvain.best_partition(G)
    return community_louvain.modularity(partition, G)

def simulate_without_nyumatch():
    """
    Each week, each student tries to form one new connection.
    Without NYU Match, students mostly connect within their existing cluster or to friends-of-friends.
    This tends to reinforce the existing cluster structure.
    """
    G = nx.Graph()
    G.add_nodes_from(students)
    

    for c_members in clusters:
        for _ in range(len(c_members)):
            u, v = random.sample(c_members, 2)
            G.add_edge(u, v)
    
    modularities = []
    for w in range(weeks):
        for s in students:
            if random.random() < intra_cluster_prob:
                candidates = [x for x in clusters[student_cluster[s]] if x != s and not G.has_edge(s, x)]
            else:
                candidates = [x for x in students if x != s and not G.has_edge(s, x)]
            
            if candidates:
                friend = random.choice(candidates)
                G.add_edge(s, friend)
        
        mod = measure_modularity(G)
        modularities.append(mod)
    return G, modularities

def simulate_with_nyumatch():
    """
    With NYU Match, after forming edges similar to the baseline,
    we introduce a mechanism each week that ensures cross-group matches.
    """
    G = nx.Graph()
    G.add_nodes_from(students)
    
    for c_members in clusters:
        for _ in range(len(c_members)):
            u, v = random.sample(c_members, 2)
            G.add_edge(u, v)
    
    modularities = []
    for w in range(weeks):
        for s in students:
            if random.random() < intra_cluster_prob:
                candidates = [x for x in clusters[student_cluster[s]] if x != s and not G.has_edge(s, x)]
                candidates = [x for x in clusters[student_cluster[s]] if x != s and not G.has_edge(s, x)]
            else:
                candidates = [x for x in students if x != s and not G.has_edge(s, x)]
            
            if candidates:
                friend = random.choice(candidates)
                G.add_edge(s, friend)
        
        for s in students:
            neighbors = list(G.neighbors(s))
            neighbors = list(G.neighbors(s))
            outside_friends = sum(1 for n in neighbors if student_cluster[n] != student_cluster[s])
            
            # If we don't have enough outside connections, try to add one
            # We define a simple criterion: at least 1 new outside connection per week
            if outside_friends == 0:
                candidates = [x for x in students 
                              if x != s and not G.has_edge(s, x) and student_cluster[x] != student_cluster[s]]
                
                if candidates:
                    if random.random() < nyumatch_outside_prob:
                        friend = random.choice(candidates)
                        G.add_edge(s, friend)
        
        mod = measure_modularity(G)
        modularities.append(mod)
    return G, modularities

# Run simulations
G_baseline, mods_baseline = simulate_without_nyumatch()
G_nyumatch, mods_nyumatch = simulate_with_nyumatch()

print("Modularity over weeks (Without NYU Match):")
for w, m in enumerate(mods_baseline, start=1):
    print(f" Week {w}: {m:.3f}")

print("\nModularity over weeks (With NYU Match):")
for w, m in enumerate(mods_nyumatch, start=1):
    print(f" Week {w}: {m:.3f}")

# Compare final network structures
print("\nFinal Results:")
print("Final Modularity (No NYU Match):", mods_baseline[-1])
print("Final Modularity (NYU Match):", mods_nyumatch[-1])
print("Number of Edges (No NYU Match):", G_baseline.number_of_edges())
print("Number of Edges (NYU Match):", G_nyumatch.number_of_edges())
