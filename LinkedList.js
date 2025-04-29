// Necessary Imports (you will need to use this)
const { Student } = require('./Student')
const fs = require('node:fs/promises');
/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    const node = new Node(newStudent);

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      let curr = this.head;

      while (curr.next) {
        curr = curr.next;
      }

      curr.next = node;
      this.tail = node;
    }

    this.length++;
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
    if (this.head && this.head.data.getEmail() === email) {
      this.head = this.head.next;
      this.length--;
    } else if (this.length > 1) {
      let prev = this.head;
      let curr = this.head.next;

      while (curr.next && curr.data.getEmail() !== email) {
        prev = curr;
        curr = curr.next;
      }

      if (curr.data.getEmail() === email) {
        prev.next = curr.next;
        this.length--;
      }

      if (curr === this.tail) {
        this.tail = prev;
      }
    }
  }

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    if (this.head) {
      let curr = this.head;

      while (curr.next && curr.data.getEmail() !== email) {
        curr = curr.next;
      }

      if (curr.data.getEmail() === email) {
        return curr.data;
      }
    }
    return -1
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  clearStudents() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    let names = "";
    if (this.head) {
      names += this.head.data.getName();
      let curr = this.head.next;

      while (curr) {
        names += `, ${curr.data.getName()}`;
        curr = curr.next;
      }
    }
    return names;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    const students = [];
    if (this.head) {
      let curr = this.head;

      while(curr) {
        students.push(curr.data);
        curr = curr.next;
      }
    }

    return students.sort((a, b) => {
      const nameA = a.getName().toUpperCase();
      const nameB = b.getName().toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    const students = this.#sortStudentsByName();
    return students.filter(student => student.getSpecialization() === specialization);
  }

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinAge(minAge) {
    const students = this.#sortStudentsByName();
    return students.filter(student => student.getYear() >= minAge);
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    if (this.head) {
      const students = [];
      let curr = this.head;

      while (curr) {
        const student = curr.data;
        students.push({
          name: student.getName(),
          year: student.getYear(),
          email: student.getEmail(),
          specialization: student.getSpecialization()
        });
        curr = curr.next;
      }

      try {
        const content = JSON.stringify(students);
        await fs.writeFile(fileName, content);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("The linked list is empty")
    }
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) {
    try {
      const data = await fs.readFile(fileName, { encoding: 'utf8' });
      const students = JSON.parse(data);
      this.clearStudents();

      students.forEach(studentObj => {
        const newStudent = new Student(
          studentObj.name,
          studentObj.year,
          studentObj.email,
          studentObj.specialization
        );
        this.addStudent(newStudent);
      });
    } catch (err) {
      console.error(err);
    }
  }

}

module.exports = { LinkedList }
