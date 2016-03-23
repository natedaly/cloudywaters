# Cloudy Waters

This is version **1.0.0** of the Cloudy Waters specification. It is intended to
lay out in detail all of the essential features for making the mud playable and
enjoyable enough to starting hosting somewhere and letting people play it.

## View 1: Logging In

The first interaction with CW will be creating a new character. Traditionally,
MUDs begin by asking your name. CW will begin the same way.

The first thing you see when you open CW will be a minimalist black and white
page that just says "Cloudy Waters" in large lettering and has a single text
input with placeholder text "By what name do you wish to be known?".

### Player Enters a Name

When the player enters a name, there are two possibilities:

1. The name is that of an existing player, in which case we prompt for a
   password.

2. The name is unrecognized, in which case we ask them to confirm that the name
   they entered was correct (to avoid sending existing players into new
   character creation due to a typo).

### Prompting For a Password

Prompt for a password by replacing the name input with a password input with
placeholder text "Enter your password, {{playerName}}". There are two
possibilities:

1. The password is correct, in which case log the player into the game.

2. The password is incorrect, in which case re-prompt them by clearing the
   password input and changing the placeholder text to "Wrong password. Please
   try again."

If the player gets re-prompted for the password and fails three times, clear the
session and start back at the first screen.

### Confirming An Unrecognized Name

Confirm an unrecognized name by replacing the name input with a text input with
placeholder text "Did I get that right, {{playerName}} (Y/N)?"

Don't wait for the player to hit enter. As soon as the player hits Y, y, or
Enter, send them through to character creation. Likewise as soon as they hit
N, n, Escape, or Backspace, change the text input back to the initial state,
asking for a name.

Ignore all other inputs and be sure to handle it properly if the user is very
quick to hit enter. Don't pass the keystroke on to the next view.

## View 2: Character Creation

To create a new character you'll have to make several decisions that determine
the type of character you will be. These decisions are:

1. Password
2. Gender
3. Race
4. Class
5. Speciality

Trying to avoid the feeling of a form, present the decisions as a series of
centered microforms, each replacing the other in turn, and building up a summary
of the choices made that gets displayed down the right side of the screen.

When all the questions have been answered, log the player into the game.

