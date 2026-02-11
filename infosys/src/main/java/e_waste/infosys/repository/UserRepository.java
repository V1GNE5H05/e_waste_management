package e_waste.infosys.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import e_waste.infosys.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
