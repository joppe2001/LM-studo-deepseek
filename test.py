class Calculator:
    def __init__(self):
        self.current_value = 0
        self.history = []

    def add(self, a, b):
        try:
            result = a + b
            self.current_value = result
            self.history.append(f"Added {a} and {b}: Result is {result}")
            print(result)
        except TypeError:
            print("Invalid input. Please enter numbers.")
            return None

    def subtract(self, a, b):
        try:
            result = a - b
            self.current_value = result
            self.history.append(f"Subtracted {a} from {b}: Result is {result}")
            return result
        except TypeError:
            print("Invalid input. Please enter numbers.")
            return None

    def multiply(self, a, b):
        try:
            result = a * b
            self.current_value = result
            self.history.append(f"Multiplied {a} and {b}: Result is {result}")
            return result
        except TypeError:
            print("Invalid input. Please enter numbers.")
            return None

    def divide(self, a, b):
        try:
            if b == 0:
                raise ValueError("Division by zero is not allowed")
            result = a / b
            self.current_value = result
            self.history.append(f"Divided {a} by {b}: Result is {result}")
            return result
        except (TypeError, ValueError) as e:
            print(e)
            return None

    def factorial(self, n):
        try:
            if not isinstance(n, int) or n < 0:
                raise ValueError("Factorial must be a non-negative integer")
            result = 1
            for i in range(2, n + 1):
                result *= i
            self.current_value = result
            self.history.append(f"Calculated factorial of {n}: Result is {result}")
            return result
        except ValueError as e:
            print(e)
            return None

    def square_root(self, a):
        try:
            if a < 0:
                raise ValueError("Square root of negative number is not supported in real numbers")
            result = a ** 0.5
            self.current_value = result
            self.history.append(f"Calculated square root of {a}: Result is {result}")
            return result
        except (TypeError, ValueError) as e:
            print(e)
            return None

    def show_history(self):
        if len(self.history) == 0:
            print("No calculations have been performed yet.")
        else:
            print("\nCalculation History:")
            for entry in self.history:
                print(entry)

def main():
    calculator = Calculator()
    while True:
        print("\nOptions:")
        print("1. Add")
        print("2. Subtract")
        print("3. Multiply")
        print("4. Divide")
        print("5. Factorial")
        print("6. Square Root")
        print("7. Show History")
        print("8. Clear History")
        print("9. Exit")

        choice = input("\nEnter your choice (1-9): ").strip()

        if choice == '9':
            break
        elif choice == '8':
            calculator.history.clear()
            print("History cleared.")
            continue
        else:
            try:
                num1 = float(input("Enter first number: "))
                num2 = None
                if choice in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']:
                    num2 = float(input("Enter second number: "))
                if choice == '1':
                    calculator.add(num1, num2)
                elif choice == '2':
                    calculator.subtract(num1, num2)
                elif choice == '3':
                    calculator.multiply(num1, num2)
                elif choice == '4':
                    calculator.divide(num1, num2)
                elif choice == '5':
                    calculator.factorial(int(num1))
                elif choice == '6':
                    calculator.square_root(num1)
                elif choice == '7':
                    calculator.show_history()
                else:
                    print("Invalid choice. Please try again.")
            except ValueError:
                print("Please enter valid numbers.")

if __name__ == "__main__":
    main()