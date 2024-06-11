const Project = ({ project }) => {

    return (
        <div>
            <img src={project.image} />
            <h2>{project.name}</h2>
            <p><i className="bi bi-geo-alt"></i> {project.location}</p>
        </div>
    )
}

export default Project;