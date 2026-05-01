// Interviewer follow-up questions for every NeetCode 150 problem.
//
// Strategy: a per-category default (3 questions that generalize well to
// any problem in that pattern) + a per-slug override for famous problems
// where a more specific follow-up is the obvious thing an interviewer
// would ask. Looked up via dsaQuestions(slug, category): returns the
// override if present, else the category default.

export const DSA_CATEGORY_DEFAULTS = {
  "Arrays & Hashing": [
    "What's the time and space complexity? Where can you tighten it?",
    "Walk through edge cases: empty input, single element, all duplicates, negatives.",
    "Why is a hash map / hash set the right structure here? When would a sorted structure beat it?",
  ],
  "Two Pointers": [
    "What invariant do the two pointers preserve, and why does that prove correctness?",
    "Why is this O(n) and not O(n²) — what guarantees each element is visited a bounded number of times?",
    "Walk through edge cases: empty input, all duplicates, sorted vs unsorted.",
  ],
  "Sliding Window": [
    "Is this a fixed-size or variable-size window? Why does that fit this problem?",
    "What's the invariant inside the window, and how do you maintain it on shrink/expand?",
    "Why is the overall pass O(n) even though the inner loop looks like it could be O(n²)?",
  ],
  Stack: [
    "Why a stack here — what LIFO property does the problem exploit?",
    "If this uses a monotonic stack, state the monotonic invariant and how it's restored on each push.",
    "Walk through complexity: each element is pushed and popped at most once, so the total work is O(n).",
  ],
  "Binary Search": [
    "State your loop invariant precisely — what must be true on every iteration?",
    "Why does the loop terminate, and how do you avoid infinite loops on the search-space update?",
    "Walk through edge cases: empty array, target smaller than min, target larger than max, duplicates.",
  ],
  "Linked List": [
    "Walk through your pointer hazards — what breaks if you lose track of the head or a prev pointer?",
    "Can you do this in-place (O(1) extra space)? What's the trick?",
    "How would you detect / handle a cycle, and prove your method's correctness?",
  ],
  Trees: [
    "Compare BFS vs DFS for this problem — which fits, and what's the iterative version?",
    "What's the recursion's space cost on the stack, and how would you go iterative if you needed O(log n)?",
    "What's the relationship between this problem's invariant and the BST property (if any)?",
  ],
  Tries: [
    "Why a trie over a hash map — what queries does the trie make cheaper?",
    "What's the time/space trade-off vs storing all suffixes?",
    "How would you support deletion or wildcard matching efficiently?",
  ],
  "Heap / Priority Queue": [
    "Why is a heap the right structure? Could a balanced BST or sorted list work — why is heap better?",
    "Explain the heap-of-k pattern: keep size k, push new, pop if over k. What's the resulting complexity?",
    "What does the comparator look like, and how would you tweak it to flip min/max behaviour?",
  ],
  Backtracking: [
    "Walk through your pruning strategy — what subtrees do you skip and why is it safe?",
    "Where does memoization apply? Could this be a DP problem in disguise?",
    "What's the worst-case time complexity, and what's the depth of the recursion stack?",
  ],
  Graphs: [
    "Is this BFS, DFS, or Union-Find? Defend the choice over the other two.",
    "Walk through complexity in terms of V and E. Where do those costs come from?",
    "How would you handle disconnected components, self-loops, or duplicate edges?",
  ],
  "Advanced Graphs": [
    "Pick between Dijkstra, Bellman-Ford, Floyd-Warshall, MST (Prim/Kruskal), or topo sort — defend the choice.",
    "What does this problem assume about edge weights (non-negative? integer? bounded?) — and what breaks if those don't hold?",
    "Walk me through complexity in V and E, and the data-structure choice (heap vs Fibonacci heap vs array).",
  ],
  "1-D DP": [
    "State the DP: define the state, the transition, and the base case explicitly.",
    "Top-down (memoized recursion) vs bottom-up (tabulation) — which is more natural here, and why?",
    "Can you space-optimize from O(n) to O(1)? Show the rolling-window trick.",
  ],
  "2-D DP": [
    "State the 2-D DP: indices, recurrence, base case. What's the order of fill?",
    "Can you reduce 2-D to 1-D by reusing rows or columns? Walk through the dependency direction.",
    "Top-down with memoization vs bottom-up — which is easier to reason about, and which is faster in practice?",
  ],
  Greedy: [
    "Prove the greedy choice — why is the locally-optimal pick safe globally? (Exchange argument or staying-ahead.)",
    "When does greedy fail on a similar-looking problem, and what would you reach for instead (DP, BFS)?",
    "Walk through edge cases that often break naive greedy: ties, negatives, single element.",
  ],
  Intervals: [
    "Do you sort by start or by end? Defend the choice based on the invariant you need.",
    "Walk through merge / overlap detection: what's your condition for 'overlapping'?",
    "How does complexity break down: O(n log n) sort + O(n) sweep — can you do better in any case?",
  ],
  "Math & Geometry": [
    "Where does integer overflow / negative input / zero hide here, and how do you guard against it?",
    "Can you derive a closed-form solution, and how does it compare to the iterative one?",
    "Walk through edge cases: 0, 1, max int, min int, negative input.",
  ],
  "Bit Manipulation": [
    "Walk me through the bit trick used here, bit by bit on a small input.",
    "Why XOR / AND / shift specifically — what property of that operation does the problem exploit?",
    "What's the complexity in terms of bits (often O(32) → O(1)), and where could that break for big-int?",
  ],
};

// Per-problem overrides: only for famous problems where a more specific
// follow-up beats the category default. Falls through to the category
// default when not present.
export const DSA_PROBLEM_QUESTIONS = {
  "two-sum": [
    "Walk through the brute-force O(n²), then explain how the hash map drops it to O(n).",
    "What if the array is sorted — can you do better in space (two-pointer, O(1))?",
    "What if duplicates are allowed and you need ALL pairs, not just one?",
  ],
  "contains-duplicate": [
    "Compare hash-set O(n)/O(n) vs sort-and-scan O(n log n)/O(1) — when do you pick each?",
    "What if the array doesn't fit in memory — how would you detect duplicates with limited RAM?",
  ],
  "valid-anagram": [
    "Compare sorting (O(n log n)) vs counting-array (O(n), 26 buckets) — when do you pick each?",
    "What if the strings include Unicode — does your counting-array still work?",
  ],
  "group-anagrams": [
    "What's your hash key — sorted string vs character-count tuple? Trade-offs?",
    "How does this scale to a streaming input where new strings keep arriving?",
  ],
  "top-k-frequent-elements": [
    "Walk through bucket sort (O(n)) vs heap of k (O(n log k)) — when does each win?",
    "What if k is much larger than the unique-element count?",
  ],
  "product-of-array-except-self": [
    "Why can't you use division? Walk through the prefix/suffix product trick.",
    "Can you do it with O(1) extra space (not counting output)?",
  ],
  "longest-consecutive-sequence": [
    "Why does the 'only start counting from a number whose predecessor is missing' trick give you O(n)?",
    "Walk through with all duplicates — does your algorithm still hit O(n)?",
  ],
  "valid-palindrome": [
    "How do you handle non-alphanumerics and case — what's your filter logic?",
    "What if the string is huge and streamed — can you process it without loading it all?",
  ],
  "3sum": [
    "How do you avoid duplicate triples without a set — what's the skip-duplicates pattern?",
    "Generalize to k-sum: what's the recursion, and what's the complexity?",
  ],
  "container-with-most-water": [
    "Prove that moving the shorter pointer can never lose the optimal answer.",
    "How is this different from trapping rain water, even though both look similar?",
  ],
  "trapping-rain-water": [
    "Compare DP (precompute left-max, right-max) vs two-pointer O(1) space — walk through the two-pointer invariant.",
    "What if rainwater can flow off the sides — how does that change anything?",
  ],
  "best-time-to-buy-and-sell-stock": [
    "Walk through the one-pass min-so-far trick. Why is it correct?",
    "What if you can buy and sell unlimited times? What about with a cooldown or fee?",
  ],
  "longest-substring-without-repeating-characters": [
    "Why is this a sliding window? What's the invariant inside the window?",
    "What if the alphabet is huge (Unicode) vs tiny (ASCII)? Does that change your data structure?",
  ],
  "minimum-window-substring": [
    "Walk through your shrink condition — when do you safely move the left pointer?",
    "How do you handle duplicate characters in t (e.g., 'aabb')?",
  ],
  "valid-parentheses": [
    "Walk through the stack invariant on a small mixed input.",
    "What if the input might be malformed mid-stream — how do you fail fast?",
  ],
  "min-stack": [
    "How do you support getMin in O(1) — what's the auxiliary stack trick?",
    "Can you do it with a single stack of pairs, and what's the trade-off?",
  ],
  "daily-temperatures": [
    "What's the monotonic-stack invariant, and how does each pop give you the answer?",
    "Why is the total work O(n) when the inner loop looks O(n²)?",
  ],
  "largest-rectangle-in-histogram": [
    "Walk through the monotonic stack — what does popping a bar tell you about its rectangle?",
    "How does this generalize to 'maximal rectangle in a binary matrix'?",
  ],
  "binary-search": [
    "What's your binary-search template (left ≤ right, left < right) and which one are you using and why?",
    "Walk through the bug-prone bits: mid calculation overflow, off-by-one on bounds.",
  ],
  "find-minimum-in-rotated-sorted-array": [
    "Why does mid-vs-right comparison work but mid-vs-left can mislead with duplicates?",
    "How does the algorithm change if duplicates are allowed?",
  ],
  "search-in-rotated-sorted-array": [
    "How do you decide which half is sorted on each step? Walk through with a small example.",
    "What changes if duplicates are allowed (LC 81)?",
  ],
  "median-of-two-sorted-arrays": [
    "Walk through the partition idea: pick i in A, derive j in B from it.",
    "Why is the binary search on the smaller array, and what's the worst-case complexity?",
  ],
  "reverse-linked-list": [
    "Show both iterative (3 pointers) and recursive solutions. Compare stack space.",
    "What if you only want to reverse a sub-range [m, n]?",
  ],
  "merge-two-sorted-lists": [
    "How would you generalize this to merging k sorted lists efficiently?",
    "Can you do it in-place without a dummy node? What's gained / lost?",
  ],
  "linked-list-cycle": [
    "Walk through Floyd's tortoise & hare — why must they meet inside the cycle?",
    "How do you find the start of the cycle (LC 142) once you've detected one?",
  ],
  "lru-cache": [
    "Why hash map + doubly linked list — what does each give you in O(1)?",
    "How would you make this thread-safe? What's the simplest correct approach?",
  ],
  "merge-k-sorted-lists": [
    "Compare divide-and-conquer (pairwise merge, O(N log k)) vs heap-of-k-heads (also O(N log k)) — when does each win in practice?",
    "What if the lists are streaming — does the heap approach still work?",
  ],
  "invert-binary-tree": [
    "Show both iterative (BFS / DFS with stack) and recursive solutions.",
    "What's the space cost of the recursive version on a skewed tree?",
  ],
  "lowest-common-ancestor-of-a-binary-search-tree": [
    "How does the BST property let you avoid traversing the whole tree?",
    "Generalize to a non-BST binary tree (LC 236) — how does the algorithm change?",
  ],
  "binary-tree-level-order-traversal": [
    "Walk through BFS with queue. How do you cleanly separate one level from the next?",
    "Can you do this DFS-recursively while still grouping by level?",
  ],
  "validate-binary-search-tree": [
    "Why is checking 'left.val < node.val < right.val' insufficient — what's the right invariant?",
    "Compare in-order traversal vs min/max-bound recursion.",
  ],
  "binary-tree-maximum-path-sum": [
    "What does the recursion return vs what it updates globally? Why those two different things?",
    "What's the time and space complexity, and where does the space go?",
  ],
  "kth-largest-element-in-an-array": [
    "Compare heap (O(n log k)), sort (O(n log n)), quickselect (O(n) avg) — when does each fit?",
    "What's quickselect's worst case, and how do you avoid it (median-of-medians, randomization)?",
  ],
  "find-median-from-data-stream": [
    "Walk through the two-heaps trick (max-heap left, min-heap right). What invariant ties them?",
    "What's the space cost over a long-running stream, and how would you bound it (windowed median)?",
  ],
  subsets: [
    "Compare backtracking vs iterative bitmask vs recursive include/exclude.",
    "How does this change for subsets-with-duplicates (LC 90)?",
  ],
  "combination-sum": [
    "How do you avoid duplicate combinations without a set — what's the index-passing trick?",
    "Compare with combination-sum-ii where each candidate can only be used once.",
  ],
  "word-search": [
    "Walk through DFS with a 'visited' marker on the board (in-place vs aux). Trade-offs?",
    "How does this scale to 'word search ii' with a trie of many target words?",
  ],
  "n-queens": [
    "How do you check 'queen attacks me' in O(1) using the diagonal-set trick?",
    "What's the state-space size, and how much does pruning actually save in practice?",
  ],
  "number-of-islands": [
    "Compare DFS, BFS, and Union-Find — pick one and defend it.",
    "What if the grid is huge and streamed (rows arrive one at a time)?",
  ],
  "course-schedule": [
    "Compare BFS-based topological sort (Kahn's) vs DFS with cycle detection.",
    "How does this extend to course-schedule-ii where you must output the order?",
  ],
  "word-ladder": [
    "Why BFS over DFS for shortest path?",
    "What's the trick with the wildcard pattern (e.g., 'h*t') to build neighbours efficiently?",
  ],
  "alien-dictionary": [
    "Walk through how you derive edges from adjacent words. What's the failure case (prefix mismatch)?",
    "How do you detect that the ordering is impossible / inconsistent?",
  ],
  "climbing-stairs": [
    "Recognize this as Fibonacci. Walk through DP → space-optimized to O(1).",
    "Generalize to 'k steps at a time' — how does the recurrence change?",
  ],
  "house-robber": [
    "State the DP: rob(i) = max(rob(i-1), rob(i-2) + nums[i]).",
    "Generalize to house-robber-ii (circular street) — what's the trick?",
  ],
  "longest-palindromic-substring": [
    "Compare expand-around-center (O(n²) time, O(1) space) vs Manacher's (O(n)).",
    "Why is DP O(n²) time AND O(n²) space — and does it actually beat expand-around-center in practice?",
  ],
  "coin-change": [
    "State the DP and the order of fills. Why does coin-first-then-amount give you each combination?",
    "How does coin-change-ii (number of ways) differ from coin-change-i (min coins)?",
  ],
  "longest-increasing-subsequence": [
    "Walk through DP O(n²). Then walk through patience-sorting O(n log n) with binary search.",
    "What's the DIFFERENCE between LIS length and the actual subsequence — how do you reconstruct?",
  ],
  "edit-distance": [
    "State the DP recurrence on (i, j) and the three cases (insert, delete, replace).",
    "Can you space-optimize to O(min(m, n))?",
  ],
  "unique-paths": [
    "Closed-form via combinatorics: C(m+n-2, m-1). Why is it equivalent to the DP answer?",
    "How do obstacles change the recurrence (unique-paths-ii)?",
  ],
  "longest-common-subsequence": [
    "State the DP. How does it relate to edit distance and to longest-common-substring?",
    "Space-optimize from O(m·n) to O(min(m, n)).",
  ],
  "maximum-subarray": [
    "Walk through Kadane's algorithm. State the loop invariant.",
    "How does maximum-product-subarray differ — what extra state do you carry?",
  ],
  "jump-game": [
    "Why does greedy (track max-reach) work? Where would DP be unnecessary?",
    "How does jump-game-ii (min jumps) differ in approach?",
  ],
  "merge-intervals": [
    "Why sort by start (not end) for THIS problem — and contrast with non-overlapping-intervals.",
    "How does this scale if intervals stream in unsorted?",
  ],
  "meeting-rooms-ii": [
    "Compare heap-based (O(n log n)) vs sweep-line (start/end events) approaches.",
    "What if you need to assign each meeting to a specific room, not just count?",
  ],
  "single-number": [
    "Why does XOR-all give the unique element when others appear twice?",
    "How does this generalize when others appear three times (LC 137)?",
  ],
};

/**
 * Returns 2-5 interviewer follow-up questions for a NeetCode problem.
 * Falls back to the category default when no problem-specific override
 * is registered.
 */
export function dsaQuestions(slug, category) {
  const specific = DSA_PROBLEM_QUESTIONS[slug];
  if (specific && specific.length >= 2) return specific.slice(0, 5);
  const generic = DSA_CATEGORY_DEFAULTS[category];
  return generic ? generic.slice(0, 5) : null;
}
