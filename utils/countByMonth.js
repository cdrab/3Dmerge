const contByMonth = (countUserByYear)=>{
    const userCountsByMonth = {};

  countUserByYear.forEach((user) => {
    const month = user.getDataValue("month");

    const key = `${month}`;
    if (userCountsByMonth[key]) {
      userCountsByMonth[key]++;
    } else {
      userCountsByMonth[key] = 1;
    }
  });

  // Étape 3 : Générez un tableau d'objets avec les résultats.
  const userCountsArray = [];

  for (const key in userCountsByMonth) {
    if (userCountsByMonth.hasOwnProperty(key)) {
      userCountsArray.push({
        month: key,
        count: userCountsByMonth[key],
      });
    }
  }

  // Triez le tableau par mois (facultatif)
  userCountsArray.sort((a, b) => {
    return a.month - b.month;
  });

 return userCountsArray
}