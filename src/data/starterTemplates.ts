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
        # TODO: Implement your Two Sum python solution here
        # Return a list containing the indices
        pass
`;
      }
      if (problemId === 'arr-2') {
        return `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        # TODO: Implement Best Time to Buy & Sell Stock solution
        pass
`;
      }
      if (problemId === 'arr-3') {
        return `class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        # TODO: Implement Product of Array Except Self
        pass
`;
      }
      return `class Solution:
    def ${snakeTitle}(self, *args, **kwargs):
        # TODO: Implement intermediate solution for ${problemTitle}
        # returns expected output
        pass
`;

    case 'java':
      if (problemId === 'arr-1') {
        return `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // TODO: Implement your Two Sum Java solution here
        return new int[]{};
    }
}
`;
      }
      if (problemId === 'arr-2') {
        return `import java.util.*;

public class Solution {
    public int maxProfit(int[] prices) {
        // TODO: Implement Best Time to Buy & Sell Stock solutions
        return 0;
    }
}
`;
      }
      if (problemId === 'arr-3') {
        return `import java.util.*;

public class Solution {
    public int[] productExceptSelf(int[] nums) {
        // TODO: Implement Product of Array Except Self
        return new int[]{};
    }
}
`;
      }
      return `import java.util.*;

public class Solution {
    public Object ${camelTitle}() {
        // TODO: Implement helper solution for ${problemTitle}
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
        // TODO: Implement solution for Two Sum in C++
        return {};
    }
};
`;
      }
      if (problemId === 'arr-2') {
        return `#include <vector>

using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // TODO: Implement solution for Max Stock Profit
        return 0;
    }
};
`;
      }
      if (problemId === 'arr-3') {
        return `#include <vector>

using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        // TODO: Implement solution for Product of Array Except Self
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
        // TODO: Implement solution for Two Sum in Kotlin
        return intArrayOf()
    }
}
`;
      }
      if (problemId === 'arr-2') {
        return `class Solution {
    fun maxProfit(prices: IntArray): Int {
        // TODO: Implement solution for Max Stock Profit
        return 0;
    }
}
`;
      }
      if (problemId === 'arr-3') {
        return `class Solution {
    fun productExceptSelf(nums: IntArray): IntArray {
        // TODO: Implement solution for Product of Array Except Self
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

export function getSolutionCode(problemId: string, problemTitle: string, language: string): string {
  const pascalTitle = problemTitle.replace(/[^a-zA-Z0-9]/g, '');
  const camelTitle = pascalTitle.charAt(0).toLowerCase() + pascalTitle.slice(1);
  const snakeTitle = problemTitle.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');

  switch (language.toLowerCase()) {
    case 'python':
      if (problemId === 'arr-1') {
        return `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Using a Hash Map for O(N) time and O(N) space complexity
        seen = {}
        for index, value in enumerate(nums):
            complement = target - value
            if complement in seen:
                return [seen[complement], index]
            seen[value] = index
        return []
`;
      }
      if (problemId === 'arr-2') {
        return `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        # Time Complexity: O(N), Space Complexity: O(1)
        if not prices:
            return 0
        min_price = prices[0]
        max_profit = 0
        for price in prices:
            min_price = min(min_price, price)
            max_profit = max(max_profit, price - min_price)
        return max_profit
`;
      }
      if (problemId === 'arr-3') {
        return `class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        # Prefix & Suffix Products: O(N) Time, O(1) auxiliary space
        n = len(nums)
        ans = [1] * n
        for i in range(1, n):
            ans[i] = ans[i-1] * nums[i-1]
        
        right = 1
        for i in range(n - 1, -1, -1):
            ans[i] = ans[i] * right
            right = right * nums[i]
        return ans
`;
      }
      return `class Solution:
    def ${snakeTitle}(self, *args, **kwargs):
        # Reference Solution for: ${problemTitle}
        # Time Complexity: O(N) average
        # TODO: Implement custom production algorithmic logic on sandbox environment
        return True
`;

    case 'java':
      if (problemId === 'arr-1') {
        return `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // One-pass Hash Map approach: O(N) Time, O(N) Space
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
      if (problemId === 'arr-2') {
        return `import java.util.*;

public class Solution {
    public int maxProfit(int[] prices) {
        // O(N) Time with track of history Prefix Minimums
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int i = 0; i < prices.length; i++) {
            if (prices[i] < minPrice) {
                minPrice = prices[i];
            } else if (prices[i] - minPrice > maxProfit) {
                maxProfit = prices[i] - minPrice;
            }
        }
        return maxProfit;
    }
}
`;
      }
      if (problemId === 'arr-3') {
        return `import java.util.*;

public class Solution {
    public int[] productExceptSelf(int[] nums) {
        // Prefix and Suffix arrays merged to O(1) Aux Space
        int length = nums.length;
        int[] answer = new int[length];
        
        answer[0] = 1;
        for (int i = 1; i < length; i++) {
            answer[i] = nums[i - 1] * answer[i - 1];
        }
        
        int R = 1;
        for (int i = length - 1; i >= 0; i--) {
            answer[i] = answer[i] * R;
            R *= nums[i];
        }
        
        return answer;
    }
}
`;
      }
      return `import java.util.*;

public class Solution {
    public Object ${camelTitle}() {
        // Reference Solution stub for: ${problemTitle}
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
        // O(N) Hash map solution
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
      if (problemId === 'arr-2') {
        return `#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int min_price = 1e9;
        int max_profit = 0;
        for (int price : prices) {
            min_price = min(min_price, price);
            max_profit = max(max_profit, price - min_price);
        }
        return max_profit;
    }
};
`;
      }
      if (problemId === 'arr-3') {
        return `#include <vector>

using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> ans(n, 1);
        for (int i = 1; i < n; ++i) {
            ans[i] = ans[i - 1] * nums[i - 1];
        }
        int right = 1;
        for (int i = n - 1; i >= 0; --i) {
            ans[i] *= right;
            right *= nums[i];
        }
        return ans;
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
        // Reference Solution stub for ${problemTitle}
    }
};
`;

    case 'kotlin':
      if (problemId === 'arr-1') {
        return `import java.util.HashMap

class Solution {
    fun twoSum(nums: IntArray, target: Int): IntArray {
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
      if (problemId === 'arr-2') {
        return `import kotlin.math.max
import kotlin.math.min

class Solution {
    fun maxProfit(prices: IntArray): Int {
        if (prices.isEmpty()) return 0
        var minPrice = prices[0]
        var maxProfit = 0
        for (price in prices) {
            minPrice = min(minPrice, price)
            maxProfit = max(maxProfit, price - minPrice)
        }
        return maxProfit;
    }
}
`;
      }
      if (problemId === 'arr-3') {
        return `class Solution {
    fun productExceptSelf(nums: IntArray): IntArray {
        val n = nums.size
        val ans = IntArray(n) { 1 }
        for (i in 1 until n) {
            ans[i] = ans[i - 1] * nums[i - 1]
        }
        var right = 1
        for (i in n - 1 downTo 0) {
            ans[i] *= right
            right *= nums[i]
        }
        return ans
    }
}
`;
      }
      return `class Solution {
    fun ${camelTitle}() {
        // Reference solution stub for ${problemTitle}
    }
}
`;

    default:
      return `// UNSUPPORTED LANGUAGE`;
  }
}
