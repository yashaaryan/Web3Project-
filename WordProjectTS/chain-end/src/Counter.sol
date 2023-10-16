// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    string[] private words;
    uint256 private num = 2;

    constructor() {
        // Initialize the word array
        string memory inputString = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do';
        string[] memory initialWords = splitWords(inputString);
        for (uint256 i = 0; i < initialWords.length; i++) {
            words.push(initialWords[i]);
        }
    }

    event WordAdded(string word);

    
    // 
    function getWords() public view returns (string[] memory) {
        uint256 startIndex = 0;
        uint256 endIndex = num;
        require(startIndex >= 0 && endIndex < words.length, "Invalid indices");
        string[] memory selectedWords = new string[](endIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            selectedWords[i - startIndex] = words[i];
        }
        return selectedWords;
    }

  
    function getNum() public view returns (uint256) {
        return num;
    }

    function setNum(uint256 newNum) public returns (uint256) {
        require(newNum < words.length, "cannot set num more than length of array");
        num = newNum;
        return num;
    }

    function splitWords(string memory input) internal pure returns (string[] memory) {
        bytes memory bytesInput = bytes(input);
        uint256 wordCount = 0;
        for (uint256 i = 0; i < bytesInput.length; i++) {
            if (bytesInput[i] == bytes(" ")[0]) {
                wordCount++;
            }
        }
        string[] memory wordArray = new string[](wordCount + 1);
        uint256 wordStart = 0;
        uint256 currentWordIndex = 0;
        for (uint256 i = 0; i < bytesInput.length; i++) {
            if (bytesInput[i] == bytes(" ")[0]) {
                wordArray[currentWordIndex] = substring(input, wordStart, i - 1);
                wordStart = i + 1;
                currentWordIndex++;
            }
        }
        // Add the last word
        wordArray[currentWordIndex] = substring(input, wordStart, bytesInput.length - 1);
        return wordArray;
    }
  //new 
    function substring(string memory str, uint256 startIndex, uint256 endIndex) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        require(startIndex <= endIndex && endIndex < strBytes.length, "Invalid substring ");
        bytes memory result = new bytes(endIndex - startIndex + 1);
        for (uint256 i = startIndex; i <= endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }
}