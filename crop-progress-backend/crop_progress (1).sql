-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 19, 2026 at 04:39 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crop_progress`
--

-- --------------------------------------------------------

--
-- Table structure for table `field_management`
--

CREATE TABLE `field_management` (
  `field_id` int(11) NOT NULL,
  `field_name` varchar(255) DEFAULT NULL,
  `field_location` varchar(255) DEFAULT NULL,
  `crop_type` varchar(255) DEFAULT NULL,
  `planting_date` datetime DEFAULT NULL,
  `insights` varchar(255) DEFAULT NULL,
  `status_description` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `harvesting_date` datetime DEFAULT NULL,
  `last_updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `computed_status` enum('Active','At Risk','Completed') DEFAULT 'Active',
  `current_stage` enum('Planted','Growing','Ready','Harvested') DEFAULT 'Planted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `field_management`
--

INSERT INTO `field_management` (`field_id`, `field_name`, `field_location`, `crop_type`, `planting_date`, `insights`, `status_description`, `user_id`, `harvesting_date`, `last_updated_at`, `computed_status`, `current_stage`) VALUES
(1, 'Lower Farm Block A', 'Nairobi North', 'Maize', '2026-03-01 00:00:00', 'Harvesting complete, yield was above average.', 'Initial planting successful', 1, '2026-04-15 00:00:00', '2026-04-19 14:29:36', 'Completed', 'Harvested');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `users_role` varchar(255) DEFAULT NULL,
  `phone_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `users_role`, `phone_number`) VALUES
(1, 'Chris Leo', 'chris@gmail.com', '$2b$12$ThumnTEAF8DHVTUH3JI0YOrrO7xjdI7OpvhjbSR14sqJENoodIA0y', 'admin', 123456789);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `field_management`
--
ALTER TABLE `field_management`
  ADD PRIMARY KEY (`field_id`),
  ADD KEY `fk_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone_number` (`phone_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `field_management`
--
ALTER TABLE `field_management`
  MODIFY `field_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `field_management`
--
ALTER TABLE `field_management`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
