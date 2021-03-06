# Set directory
setwd("~/data-viz/r")

# Load packages
if (!require(plyr)) install.packages("plyr")
        library(plyr)
if (!require(ggplot2)) install.packages("ggplot2")
        library(ggplot2)

# Read data
lgas <- read.csv("lgas.csv")
fac <- read.csv("Health_Mopup_and_Baseline_NMIS_Facility.csv")

# Combine data sets into single data.frame
df <- merge(lgas, fac, by = "unique_lga")

# Keep only data in the Southern zone
df <- df[df$zone == 'Southeast' | df$zone == 'South-South' | df$zone == 'Southwest',]
write.csv(df, "southern_facilities_with_meta_data.csv")

# Aggregate data by state
df2 <- aggregate(cbind(num_nurses_fulltime, num_doctors_fulltime, pop_2006, area_sq_km) ~ state, df, sum, na.rm = TRUE)

# Create 4 new variables
df2 <- transform(df2, per_capita_nurses = num_nurses_fulltime/pop_2006)
df2 <- transform(df2, per_area_nurses = num_nurses_fulltime/area_sq_km)
df2 <- transform(df2, per_capita_doctors = num_doctors_fulltime/pop_2006)
df2 <- transform(df2, per_area_doctors = num_doctors_fulltime/area_sq_km)

# Sort in descending order of population
df2 <- arrange(df2, desc(pop_2006))
write.csv(df2, "healtcare_workers_by_state.csv")

# Visualize
# Absolute variables
ggplot(data = df2, aes(x = state)) +
        geom_point(data = df2, aes(y = num_nurses_fulltime), colour = 'blue', size = 3) +
        geom_point(data = df2, aes(y = num_doctors_fulltime), colour = 'red', size = 3)
        
# Relative variables (per population)       
ggplot(data = df2, aes(x = state)) +        
        geom_point(data = df2, aes(y = per_capita_nurses), colour = 'blue', size = 3) + 
        geom_point(data = df2, aes(y = per_capita_doctors), colour = 'red', size = 3)

# Relative variables (per area)       
ggplot(data = df2, aes(x = state)) +        
        geom_point(data = df2, aes(y = per_area_nurses), colour = 'blue', size = 3) + 
        geom_point(data = df2, aes(y = per_area_doctors), colour = 'red', size = 3)
