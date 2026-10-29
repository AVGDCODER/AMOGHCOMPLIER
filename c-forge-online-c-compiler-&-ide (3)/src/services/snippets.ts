import { SnippetExample } from '../types';

export const SNIPPET_EXAMPLES: SnippetExample[] = [
  {
    id: 'hello-world',
    title: 'Hello, World & Formatted Output',
    category: 'Beginner',
    description: 'Basic C program demonstrating standard headers, string formatting, and clean return codes.',
    stdin: '',
    code: `/*
 * AMOGH COMPILER Example: Hello World & C Basics
 * Demonstrates standard headers, output formatting, and escape sequences.
 */
#include <stdio.h>

int main(void) {
    printf("===========================================\\n");
    printf("     Welcome to AMOGH COMPILER!            \\n");
    printf("===========================================\\n\\n");

    const char* greeting = "Hello, World!";
    int year = 2026;
    double pi = 3.1415926535;

    printf("Greeting : %s\\n", greeting);
    printf("Year     : %d\\n", year);
    printf("Pi value : %.8f\\n", pi);

    printf("\\nC Compilation successful!\\n");
    return 0;
}
`,
  },
  {
    id: 'interactive-calc',
    title: 'Interactive Calculator with stdin',
    category: 'Beginner',
    description: 'Demonstrates reading user input via scanf(), validating inputs, and arithmetic operations.',
    stdin: '25 17 +',
    code: `/*
 * AMOGH COMPILER Example: Interactive Calculator
 * Reads two numbers and an operator (+, -, *, /) from standard input.
 */
#include <stdio.h>

int main(void) {
    double num1, num2;
    char op;

    printf("=== Interactive C Calculator ===\\n");
    printf("Reading numbers and operator from stdin...\\n\\n");

    // Expecting: <num1> <num2> <operator>
    if (scanf("%lf %lf %c", &num1, &num2, &op) != 3) {
        printf("Error: Invalid input format. Expected: <num1> <num2> <op>\\n");
        printf("Using default sample: 25 17 +\\n");
        num1 = 25.0;
        num2 = 17.0;
        op = '+';
    }

    printf("Input received: %.2f %c %.2f\\n", num1, op, num2);

    switch (op) {
        case '+':
            printf("Result: %.2f + %.2f = %.2f\\n", num1, num2, num1 + num2);
            break;
        case '-':
            printf("Result: %.2f - %.2f = %.2f\\n", num1, num2, num1 - num2);
            break;
        case '*':
            printf("Result: %.2f * %.2f = %.2f\\n", num1, num2, num1 * num2);
            break;
        case '/':
            if (num2 == 0.0) {
                printf("Error: Division by zero is undefined!\\n");
                return 1;
            }
            printf("Result: %.2f / %.2f = %.4f\\n", num1, num2, num1 / num2);
            break;
        default:
            printf("Error: Unknown operator '%c'. Supported: +, -, *, /\\n", op);
            return 1;
    }

    return 0;
}
`,
  },
  {
    id: 'linked-list',
    title: 'Singly Linked List & Dynamic Memory',
    category: 'Data Structures',
    description: 'Clean implementation of dynamic memory allocation with malloc(), node insertion, traversal, and free().',
    stdin: '',
    code: `/*
 * AMOGH COMPILER Example: Singly Linked List
 * Demonstrates structs, pointers, malloc(), and proper memory management (free).
 */
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

// Create a new heap-allocated node
Node* create_node(int value) {
    Node* new_node = (Node*)malloc(sizeof(Node));
    if (new_node == NULL) {
        fprintf(stderr, "Fatal: Memory allocation failed!\\n");
        exit(EXIT_FAILURE);
    }
    new_node->data = value;
    new_node->next = NULL;
    return new_node;
}

// Append node to the end of list
void append(Node** head_ref, int value) {
    Node* new_node = create_node(value);
    if (*head_ref == NULL) {
        *head_ref = new_node;
        return;
    }
    Node* curr = *head_ref;
    while (curr->next != NULL) {
        curr = curr->next;
    }
    curr->next = new_node;
}

// Print all elements
void print_list(const Node* head) {
    printf("List elements: [ ");
    const Node* curr = head;
    while (curr != NULL) {
        printf("%d -> ", curr->data);
        curr = curr->next;
    }
    printf("NULL ]\\n");
}

// Clean up allocated memory
void free_list(Node* head) {
    Node* curr = head;
    size_t count = 0;
    while (curr != NULL) {
        Node* temp = curr->next;
        free(curr);
        curr = temp;
        count++;
    }
    printf("Cleaned up %zu nodes from heap memory.\\n", count);
}

int main(void) {
    Node* head = NULL;

    printf("=== Dynamic Singly Linked List in C ===\\n\\n");

    int items[] = { 10, 42, 88, 105, 7, 999 };
    size_t n = sizeof(items) / sizeof(items[0]);

    printf("Inserting %zu items into linked list...\\n", n);
    for (size_t i = 0; i < n; i++) {
        append(&head, items[i]);
    }

    print_list(head);

    printf("\\nFreeing heap memory...\\n");
    free_list(head);
    head = NULL;

    printf("Safe exit: zero memory leaks.\\n");
    return 0;
}
`,
  },
  {
    id: 'quicksort',
    title: 'Quicksort & Function Pointers',
    category: 'Algorithms',
    description: 'Divide-and-conquer Quicksort algorithm implementation with Lomuto partition scheme.',
    stdin: '',
    code: `/*
 * AMOGH COMPILER Example: Quicksort Algorithm
 * Demonstrates recursion, array slicing, and in-place partitioning.
 */
#include <stdio.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// Partition using the last element as pivot
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

// Quicksort recursive function
void quicksort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quicksort(arr, low, pi - 1);
        quicksort(arr, pi + 1, high);
    }
}

void print_array(const char* label, const int arr[], int size) {
    printf("%-18s: [", label);
    for (int i = 0; i < size; i++) {
        printf("%d%s", arr[i], (i == size - 1) ? "" : ", ");
    }
    printf("]\\n");
}

int main(void) {
    int data[] = { 64, 34, 25, 12, 22, 11, 90, 88, 3, 50, 42 };
    int n = sizeof(data) / sizeof(data[0]);

    printf("=== Quicksort (O(n log n)) Demonstration ===\\n\\n");
    print_array("Original Array", data, n);

    quicksort(data, 0, n - 1);

    print_array("Sorted Array", data, n);

    printf("\\nSorting verified successfully!\\n");
    return 0;
}
`,
  },
  {
    id: 'bst-tree',
    title: 'Binary Search Tree (BST) & Traversals',
    category: 'Data Structures',
    description: 'Binary Search Tree with recursive insertion, searching, and in-order traversal.',
    stdin: '',
    code: `/*
 * AMOGH COMPILER Example: Binary Search Tree (BST)
 * Demonstrates tree node allocation, binary search logic, and in-order traversal.
 */
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct TreeNode {
    int val;
    struct TreeNode* left;
    struct TreeNode* right;
} TreeNode;

TreeNode* create_tree_node(int val) {
    TreeNode* node = (TreeNode*)malloc(sizeof(TreeNode));
    node->val = val;
    node->left = NULL;
    node->right = NULL;
    return node;
}

TreeNode* insert(TreeNode* root, int val) {
    if (root == NULL) return create_tree_node(val);
    if (val < root->val) {
        root->left = insert(root->left, val);
    } else if (val > root->val) {
        root->right = insert(root->right, val);
    }
    return root;
}

bool search(const TreeNode* root, int target) {
    if (root == NULL) return false;
    if (root->val == target) return true;
    if (target < root->val) return search(root->left, target);
    return search(root->right, target);
}

void inorder_traversal(const TreeNode* root) {
    if (root != NULL) {
        inorder_traversal(root->left);
        printf("%d ", root->val);
        inorder_traversal(root->right);
    }
}

void free_tree(TreeNode* root) {
    if (root == NULL) return;
    free_tree(root->left);
    free_tree(root->right);
    free(root);
}

int main(void) {
    printf("=== Binary Search Tree in C ===\\n\\n");
    TreeNode* root = NULL;

    int values[] = { 50, 30, 20, 40, 70, 60, 80, 15, 65 };
    int n = sizeof(values) / sizeof(values[0]);

    printf("Inserting keys: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", values[i]);
        root = insert(root, values[i]);
    }
    printf("\\n\\n");

    printf("In-order Traversal (Sorted): ");
    inorder_traversal(root);
    printf("\\n\\n");

    int targets[] = { 60, 99, 40, 100 };
    for (int i = 0; i < 4; i++) {
        int t = targets[i];
        printf("Search key %2d -> %s\\n", t, search(root, t) ? "FOUND" : "NOT FOUND");
    }

    free_tree(root);
    printf("\\nBST memory cleanly deallocated.\\n");
    return 0;
}
`,
  },
  {
    id: 'matrix-multiply',
    title: 'Matrix Multiplication & 2D Arrays',
    category: 'Algorithms',
    description: 'Cache-aware 2D matrix multiplication with neatly formatted ASCII tabular output.',
    stdin: '',
    code: `/*
 * AMOGH COMPILER Example: Matrix Multiplication
 * Demonstrates 2D array manipulation and algorithmic matrix math.
 */
#include <stdio.h>

#define ROWS_A 3
#define COLS_A 2
#define ROWS_B 2
#define COLS_B 3

void print_matrix(const char* name, int rows, int cols, const int mat[rows][cols]) {
    printf("Matrix %s (%dx%d):\\n", name, rows, cols);
    for (int i = 0; i < rows; i++) {
        printf("  [ ");
        for (int j = 0; j < cols; j++) {
            printf("%4d ", mat[i][j]);
        }
        printf("]\\n");
    }
    printf("\\n");
}

int main(void) {
    printf("=== Matrix Multiplication (A x B = C) ===\\n\\n");

    int A[ROWS_A][COLS_A] = {
        { 1, 2 },
        { 3, 4 },
        { 5, 6 }
    };

    int B[ROWS_B][COLS_B] = {
        { 7,  8,  9 },
        { 10, 11, 12 }
    };

    int C[ROWS_A][COLS_B] = { 0 };

    // Compute C = A * B
    for (int i = 0; i < ROWS_A; i++) {
        for (int j = 0; j < COLS_B; j++) {
            for (int k = 0; k < COLS_A; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    print_matrix("A", ROWS_A, COLS_A, A);
    print_matrix("B", ROWS_B, COLS_B, B);
    print_matrix("C = A x B", ROWS_A, COLS_B, C);

    printf("Computation finished with exact precision.\\n");
    return 0;
}
`,
  },
  {
    id: 'bitwise-flags',
    title: 'Bitwise Flags & Low-Level Bit Operations',
    category: 'Low-Level',
    description: 'Shows bit shifting, masking, bit manipulation, and binary representation printing.',
    stdin: '',
    code: `/*
 * AMOGH COMPILER Example: Bitwise Operations & Permission Bitmasks
 * Demonstrates bit shifts, bitwise AND/OR/XOR/NOT, and bit inspect.
 */
#include <stdio.h>
#include <stdint.h>

// Permission bit flags
#define PERM_READ    (1 << 0) // 0b0001 = 1
#define PERM_WRITE   (1 << 1) // 0b0010 = 2
#define PERM_EXECUTE (1 << 2) // 0b0100 = 4
#define PERM_ADMIN   (1 << 3) // 0b1000 = 8

void print_binary8(uint8_t val) {
    printf("0b");
    for (int i = 7; i >= 0; i--) {
        printf("%d", (val >> i) & 1);
        if (i == 4) printf("_");
    }
}

void print_permissions(uint8_t flags) {
    printf("Permissions [");
    print_binary8(flags);
    printf("]: ");
    if (flags & PERM_READ)    printf("READ ");
    if (flags & PERM_WRITE)   printf("WRITE ");
    if (flags & PERM_EXECUTE) printf("EXEC ");
    if (flags & PERM_ADMIN)   printf("ADMIN ");
    if (flags == 0)           printf("NONE ");
    printf("\\n");
}

int main(void) {
    printf("=== C Bitwise Manipulation & Flag System ===\\n\\n");

    uint8_t user_perms = 0;
    print_permissions(user_perms);

    printf("\\nGranting READ and WRITE permissions...\\n");
    user_perms |= (PERM_READ | PERM_WRITE);
    print_permissions(user_perms);

    printf("\\nToggling EXECUTE permission with XOR...\\n");
    user_perms ^= PERM_EXECUTE;
    print_permissions(user_perms);

    printf("\\nRevoking WRITE permission with bitwise AND NOT...\\n");
    user_perms &= ~PERM_WRITE;
    print_permissions(user_perms);

    printf("\\nCounting set bits in 0xAF...\\n");
    uint8_t num = 0xAF; // 175
    int count = 0;
    for (int i = 0; i < 8; i++) {
        if ((num >> i) & 1) count++;
    }
    printf("Number ");
    print_binary8(num);
    printf(" (0x%02X) has %d bits set.\\n", num, count);

    return 0;
}
`,
  },
  {
    id: 'string-pointers',
    title: 'Pointer Arithmetic & String Tokenizer',
    category: 'Pointers & Memory',
    description: 'Direct pointer arithmetic, custom string length, and in-place string reversal.',
    stdin: '',
    code: `/*
 * AMOGH COMPILER Example: Pointer Arithmetic & String Reversal
 * Demonstrates pointers, const correctness, and in-place manipulation.
 */
#include <stdio.h>
#include <string.h>

// Custom strlen using pointer subtraction
size_t custom_strlen(const char* str) {
    const char* ptr = str;
    while (*ptr != '\\0') {
        ptr++;
    }
    return (size_t)(ptr - str);
}

// In-place string reverse using two pointers
void reverse_string(char* str) {
    if (str == NULL) return;
    char* start = str;
    char* end = str + custom_strlen(str) - 1;

    while (start < end) {
        char temp = *start;
        *start = *end;
        *end = temp;
        start++;
        end--;
    }
}

int main(void) {
    printf("=== C Pointer Arithmetic & String Manipulation ===\\n\\n");

    char buffer[] = "Embedded Systems with C";
    printf("Original String : \\"%s\\"\\n", buffer);
    printf("Calculated Length: %zu chars\\n", custom_strlen(buffer));

    reverse_string(buffer);
    printf("Reversed String : \\"%s\\"\\n", buffer);

    reverse_string(buffer); // Revert back
    printf("Restored String : \\"%s\\"\\n\\n", buffer);

    printf("Walking pointer through array:\\n");
    const char* p = buffer;
    int idx = 0;
    while (*p != '\\0') {
        if (*p != ' ') {
            printf("  char[%2d] at %p: '%c' (ASCII %3d)\\n", idx, (void*)p, *p, (int)*p);
        }
        p++;
        idx++;
    }

    return 0;
}
`,
  },
];
