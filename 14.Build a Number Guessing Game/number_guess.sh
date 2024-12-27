#!/bin/bash
PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"
((NUM_TO_GUESS=RANDOM%1001))

echo "Enter your username:"
read USERNAME
WELCOME="Welcome, $USERNAME! It looks like this is your first time here."
RESULT=$($PSQL "SELECT games_played,best_game FROM users WHERE username='$USERNAME'")
GAMES_PLAYED=""
BEST_GAME=""
if [[ -z $RESULT ]];then
  INSERT_RESULT=$($PSQL "INSERT INTO users(username,games_played) VALUES('$USERNAME',1)")
else
  UPDATE_RESULT=$($PSQL "UPDATE users SET games_played=games_played+1 WHERE username='$USERNAME'")
  IFS="|" read GAMES_PLAYED BEST_GAME <<<$RESULT
  WELCOME="Welcome back, $USERNAME! You have played $GAMES_PLAYED games, and your best game took $BEST_GAME guesses."
fi
echo $WELCOME

echo "Guess the secret number between 1 and 1000:"
read NUM
CNT=1
while ((NUM!=NUM_TO_GUESS));do
  if [[ ! $NUM =~ ^[0-9]+$ ]];then
    echo "That is not an integer, guess again:"
  elif ((NUM>NUM_TO_GUESS));then
    echo "It's higher than that, guess again:"
  else
    echo "It's lower than that, guess again:"
  fi
  read NUM
  ((CNT+=1))
done

echo "You guessed it in $CNT tries. The secret number was $NUM_TO_GUESS. Nice job!"

if [[ -z $BEST_GAME  || $CNT -lt $BEST_GAME ]];then
  _=$($PSQL "UPDATE users SET best_game=$CNT WHERE username='$USERNAME'")
fi

