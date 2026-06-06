export interface CodeTemplate {
  java: string;
  kotlin: string;
  python: string;
  cpp: string;
}

export interface ProblemTestCase {
  input: string;
  expected: string;
}

export function getProblemTestCases(problemId: string): ProblemTestCase[] {
  switch (problemId) {
    case 'arr-1': // Two Sum
      return [
        { input: "nums = [2, 7, 11, 15], target = 9", expected: "[0, 1]" },
        { input: "nums = [3, 2, 4], target = 6", expected: "[1, 2]" },
        { input: "nums = [3, 3], target = 6", expected: "[0, 1]" }
      ];
    case 'arr-2': // Best Time to Buy and Sell Stock
      return [
        { input: "prices = [7, 1, 5, 3, 6, 4]", expected: "5" },
        { input: "prices = [7, 6, 4, 3, 1]", expected: "0" }
      ];
    case 'arr-3': // Product of Array Except Self
      return [
        { input: "nums = [1, 2, 3, 4]", expected: "[24, 12, 8, 6]" },
        { input: "nums = [-1, 1, 0, -3, 3]", expected: "[0, 0, 9, 0, 0]" }
      ];
    default:
      return [
        { input: "Default Test Case 1", expected: "Expected Output" },
        { input: "Default Test Case 2", expected: "Expected Output" }
      ];
  }
}

export function getStarterCode(problemId: string, problemTitle: string, language: string): string {
  const pascalTitle = problemTitle.replace(/[^a-zA-Z0-9]/g, '');
  const camelTitle = pascalTitle.charAt(0).toLowerCase() + pascalTitle.slice(1);
  const snakeTitle = problemTitle.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');

  switch (language.toLowerCase()) {
    case 'python':
      if (problemId === 'arr-1') {
        return `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your python solution here
        num_map = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in num_map:
                return [num_map[diff], i]
            num_map[num] = i
        return []
`;
      }
      return `class Solution:
    def ${snakeTitle}(self, *args, **kwargs):
        # TODO: Implement your solution for ${problemTitle}
        # Returns the expected result
        pass
`;

    case 'java':
      if (problemId === 'arr-1') {
        return `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your Java solution here
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}
`;
      }
      return `import java.util.*;

public class Solution {
    public Object ${camelTitle}() {
        // TODO: Implement solution for ${problemTitle}
        return null;
    }
}
`;

    case 'cpp':
      if (problemId === 'arr-1') {
        return `#include <vector>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your C++ solution here
        unordered_map<int, int> num_map;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (num_map.count(complement)) {
                return {num_map[complement], i};
            }
            num_map[nums[i]] = i;
        }
        return {};
    }
};
`;
      }
      return `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    void ${camelTitle}() {
        // TODO: Implement solution for ${problemTitle}
    }
};
`;

    case 'kotlin':
      if (problemId === 'arr-1') {
        return `import java.util.HashMap

class Solution {
    fun twoSum(nums: IntArray, target: Int): IntArray {
        // Write your Kotlin solution here
        val map = HashMap<Int, Int>()
        for (i in nums.indices) {
            val complement = target - nums[i]
            if (map.containsKey(complement)) {
                return intArrayOf(map[complement]!!, i)
            }
            map[nums[i]] = i
        }
        return intArrayOf()
    }
}
`;
      }
      return `class Solution {
    fun ${camelTitle}() {
        // TODO: Implement solution for ${problemTitle}
    }
}
`;

    default:
      return `// UNSUPPORTED LANGUAGE`;
  }
}
