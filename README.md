Mutation Analysis for JavaScript
================================

Mutation analysis (mutation testing) - the process of testing a test suite by inserting errors in the system under test (SUT) and then running the test suite against the SUT in order to verify the detection of the inserted errors.

In other words, if you doubt the quality of a test suite, you can find out exactly if and where it falls short with a mutation analysis tool.

Idea
----

prerequisite: user specified SUT and a test suite, which the SUT passes.

1. Use acorn.js to generate a AST from SUT
2. Walk the generated AST with acorn.js' walker until a candidate AST node for a mutation operator is found
3. Check history/log if the candidate/operator pair has been mutated before - if so go to step 2
3. Mutate the candidate AST node
4. Record the candidate/operator pair in some history/log
5. Generate SUT' (now called mutant) from the AST with library X
6. Save the mutant temporarily
7. go to step 2 until sufficient amount of mutants have been created
8. Run test suite against all mutants, report those mutants which passed all tests

Mutation operators to begin with
--------------------------------

* ABS: Absolute value insertion
* ROR: Relational operator replacement


Operators to use later
----------------------

* LCR: Logical connector replacement
* UOI: Unary operator insertion
* AOR: Arithmetic operator replacement
