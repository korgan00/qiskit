# 1. Quantum States and Qubits

## 1.1 Introduction

TODO


----------------------------------------------------------------------------------------------------


## 1.2 The Atoms of Computation

Programming a quantum computer is now something that anyone can do in the comfort of their own home.

But what to create? What is a quantum program anyway? In fact, what is a quantum computer?

These questions can be answered by making comparisons to standard digital computers. Unfortunately, most people don’t actually understand how digital computers work either. In this article, we’ll look at the basics principles behind these devices. To help us transition over to quantum computing later on, we’ll do it using the same tools as we'll use for quantum.

Below is some Python code we'll need to run if we want to use the code in this page:

    pre.jupyter.
      from qiskit import QuantumCircuit, execute, Aer
      from qiskit.visualization import plot_histogram

---

### 1. Splitting information into bits 

The first thing we need to know about is the idea of bits. These are designed to be the world’s simplest alphabet. With only two characters, 0 and 1, we can represent any piece of information.

One example is numbers. You are probably used to representing a number through a string of the ten digits 0, 1, 2, 3, 4, 5, 6, 7, 8, and 9. In this string of digits, each digit represents how many times the number contains a certain power of ten. For example, when we write 9213, we mean

``` latex
9000 + 200 + 10 + 3
```

or, expressed in a way that emphasizes the powers of ten

``` latex
(9 × 10^3) + (2 × 10^2) + (1 × 10^1) + (3 × 10^0)
```

Though we usually use this system based on the number 10, we can just as easily use one based on any other number. The binary number system, for example, is based on the number two. This means using the two characters 0 and 1 to express numbers as multiples of powers of two. For example, 9213 becomes 10001111111101, since

``` latex
9213 = & (1×2^{13})+(0×2^{12})+(0×2^{11})+(0×2^{10})+ \\
       & (1×2^9)+(1×2^8)+ (1×2^7)+(1×2^6)+(1×2^5)+ \\
       & (1×2^4)+(1×2^3)+(1×2^2)+(0×2^1)+(1×2^0)
```

In this we are expressing numbers as multiples of 2, 4, 8, 16, 32, etc. instead of 10, 100, 1000, etc.

    pre.jupyter.
      from qiskit_textbook.widgets import binary_widget
      binary_widget(nbits=5)

These strings of bits, known as binary strings, can be used to represent more than just numbers. For example, there is a way to represent any text using bits. For any letter, number, or punctuation mark you want to use, you can find a corresponding string of at most eight bits using [this table](https://www.ibm.com/support/knowledgecenter/en/ssw_aix_72/com.ibm.aix.networkcomm/conversion_table.htm). Though these are quite arbitrary, this is a widely agreed-upon standard. In fact, it's what was used to transmit this article to you through the internet.

This is how all information is represented in computers. Whether numbers, letters, images, or sound, it all exists in the form of binary strings.

Like our standard digital computers, quantum computers are based on this same basic idea. The main difference is that they use qubits, an extension of the bit to quantum mechanics. In the rest of this textbook, we will explore what qubits are, what they can do, and how they do it. In this section, however, we are not talking about quantum at all. So, we just use qubits as if they were bits.

::: .box.f-blue

#### Quick Exercises

1. Think of a number and try to write it down in binary.
2. If you have _n_ bits, how many different states can they be in?

:::

---

### 2. Computation as a diagram 

Whether we are using qubits or bits, we need to manipulate them in order to turn the inputs we have into the outputs we need. For the simplest programs with very few bits, it is useful to represent this process in a diagram known as a circuit diagram. These have inputs on the left, outputs on the right, and operations represented by arcane symbols in between. These operations are called 'gates', mostly for historical reasons.

Here's an example of what a circuit looks like for standard, bit-based computers. You aren't expected to understand what it does. It should simply give you an idea of what these circuits look like.

    figure: x-img(src="https://qiskit.org/textbook/ch-states/images/classical_circuit.png" width=377 height=211)

For quantum computers, we use the same basic idea but have different conventions for how to represent inputs, outputs, and the symbols used for operations. Here is the quantum circuit that represents the same process as above.

    figure: x-img(src="https://qiskit.org/textbook/ch-states/images/quantum_circuit.png" width=503 height=266)

In the rest of this section, we will explain how to build circuits. At the end, you'll know how to create the circuit above, what it does, and why it is useful.

---

### 3. Your first quantum circuit 

In a circuit, we typically need to do three jobs: First, encode the input, then do some actual computation, and finally extract an output. For your first quantum circuit, we'll focus on the last of these jobs. We start by creating a circuit with eight qubits and eight outputs.

    pre.jupyter.
      n = 8
      n_q = n
      n_b = n
      qc_output = QuantumCircuit(n_q,n_b)

This circuit, which we have called `{code}qc_output`, is created by Qiskit using `{code}QuantumCircuit`. The number `{code}n_q` defines the number of qubits in the circuit. With `{code}n_b` we define the number of output bits we will extract from the circuit at the end.

The extraction of outputs in a quantum circuit is done using an operation called measure. Each measurement tells a specific qubit to give an output to a specific output bit. The following code adds a measure operation to each of our eight qubits. The qubits and bits are both labelled by the numbers from 0 to 7 (because that’s how programmers like to do things). The command qc.measure(j,j) adds a measurement to our circuit qc that tells qubit j to write an output to bit j.

{.todo} More coming soon!


----------------------------------------------------------------------------------------------------


## 1.3 Representing Qubit States

TODO


----------------------------------------------------------------------------------------------------


## 1.4 Single Qubit Gates

TODO


----------------------------------------------------------------------------------------------------


## 1.5 The Case for Quantum

TODO
